/**
 * FUNCIONES FLECHA - arrow fuctions
 *  =>
 */

const saludar = nombre => {
    if (typeof nombre === "string") { 
        return `Hola ${nombre}`
} else {
    console.error("Tipode dato equivocado")

}
}

console.log(saludar("Sebastian"))
