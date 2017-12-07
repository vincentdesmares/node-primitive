const { Step } = require('./step')
const { State } = require('./state')
const { CanvasWrapper } = require('./canvasWrapper')
const { Shape } = require('./shape')
const debugInternal = require('debug')('node-primitive:internal')

class Optimizer {
  constructor (original, cfg, document) {
    if (!document) {
      throw new Error('Document required')
    }
    this.document = document
    this.cfg = cfg
    this.state = new State(original, CanvasWrapper.empty(cfg, false, document))
    this._steps = 0
    this.onStep = () => {}
    debugInternal('initial distance %s', this.state.distance)
  }

  start () {
    debugInternal('Optimizer starting')
    this._ts = Date.now()
    return this._addShape()
  }

  async _addShape () {
    let step = await this._findBestStep()
    step = await this._optimizeStep(step)
    this._steps++
    if (step.distance < this.state.distance) {
      /* better than current state, epic */
      this.state = step.apply(this.state)
      debugInternal(
        'switched to new state (%s) with distance: %s',
        this._steps,
        this.state.distance
      )
      this.onStep(step)
    } else {
      /* worse than current state, discard */
      this.onStep(null)
    }
    return await this._continue(step)
  }

  async _continue (lastStep) {
    debugInternal('continuing')
    if (this._steps < this.cfg.steps) {
      debugInternal('Adding a new shape')
      return await this._addShape()
    } else {
      let time = Date.now() - this._ts
      debugInternal('target distance %s', this.state.distance)
      debugInternal(
        'real target distance %s',
        this.state.target.distance(this.state.canvas)
      )
      debugInternal('finished in %s', time)
      return lastStep
    }
  }

  _findBestStep () {
    const LIMIT = this.cfg.shapes

    let bestStep = null
    let promises = []

    for (let i = 0; i < LIMIT; i++) {
      let shape = Shape.create(this.cfg, this.document)

      let promise = new Step(shape, this.cfg, this.document)
        .compute(this.state)
        .then(step => {
          if (!bestStep || step.distance < bestStep.distance) {
            bestStep = step
          }
        })
      promises.push(promise)
    }

    return Promise.all(promises).then(() => bestStep)
  }

  _optimizeStep (step) {
    const LIMIT = this.cfg.mutations

    let totalAttempts = 0
    let successAttempts = 0
    let failedAttempts = 0
    let resolve = null
    let bestStep = step
    let promise = new Promise(r => (resolve = r))

    let tryMutation = () => {
      if (failedAttempts >= LIMIT) {
        debugInternal(
          'mutation optimized distance from %s to %s in (%s good, %s total) attempts',
          arguments[0].distance,
          bestStep.distance,
          successAttempts,
          totalAttempts
        )
        return resolve(bestStep)
      }

      totalAttempts++
      bestStep
        .mutate()
        .compute(this.state)
        .then(mutatedStep => {
          if (mutatedStep.distance < bestStep.distance) {
            /* success */
            successAttempts++
            failedAttempts = 0
            bestStep = mutatedStep
          } else {
            /* failure */
            failedAttempts++
          }

          tryMutation()
        })
    }

    tryMutation()

    return promise
  }
}

exports.Optimizer = Optimizer
