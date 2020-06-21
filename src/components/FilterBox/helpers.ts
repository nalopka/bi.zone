export const mockYears = () => {
    const currentYear = new Date().getFullYear();
    const years = () => {
        const result = [];
        for (let i = currentYear; i >= 1900; i--) {
            result.push(i);
        }
        return result;
    };
    return years();
};
