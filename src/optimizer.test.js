const optimizer = require("./optimizer")

// @ponicode
describe("_continue", () => {
    let inst

    beforeEach(() => {
        inst = new optimizer.Optimizer(false, "ponicode.com", "<source src=\"http://www.google.com\">")
    })

    test("0", async () => {
        await inst._continue("Abruzzo")
    })

    test("1", async () => {
        await inst._continue("Île-de-France")
    })

    test("2", async () => {
        await inst._continue("Alabama")
    })

    test("3", async () => {
        await inst._continue("Florida")
    })

    test("4", async () => {
        await inst._continue(undefined)
    })
})
