
const synchronicHexaLength = 14
const synchronicDecLengths = [10, 18]
const minLength = Math.min(...synchronicDecLengths)
const maxLength = Math.max(...synchronicDecLengths)

export default function useConvert() {
    
    const hex  =  v => !isNaN(v) ? BigInt(v).toString(16).toUpperCase() : '00000000000'
    
    const dec = hex => isHex(hex) ? BigInt('0x' + hex).toString(10) : '00000000000'

    const isHex = (string) => string.match(/^[0-9A-Fa-f]+$/)
    
    const syncHex = v => hex(v).padStart(synchronicHexaLength, '0')

    // complète le nombre décimal avec des 0 pour atteindre 10 ou 18 chiffres
    const syncDec = (v) => {
        let code = dec(v)
        let length = code.length <= minLength ? minLength : maxLength
        return code.padStart(length, '0')
    }

    const isValidSynchronicDecimal = (v) => v > 0 && synchronicDecLengths.includes(v.trim().length) // v > 0 also checks if v is a number

    const isValidSynchronicHexa = (v) => isHex(v) && v.trim().length === synchronicHexaLength

    return {hex, syncHex, dec, syncDec, isHex, isValidSynchronicDecimal, isValidSynchronicHexa}
    
}
