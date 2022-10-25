export class StringUtils {
    public removeAllNonNumericalCharacters(stringToModify: string): string {
        return stringToModify.replace(/\D/g, '');
    }
}
