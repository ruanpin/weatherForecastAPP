export function validateEnglishCommaSpaceEmpty(value) {
    // 允許空字串、英文字母、逗號、空格
    const isValid = value === "" || /^[A-Za-z,\s]*$/.test(value);
    return isValid
};