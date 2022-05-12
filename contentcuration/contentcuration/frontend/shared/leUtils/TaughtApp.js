const taughtAppMap = new Map([
    [
        'desktop',
        {text: 'Desktop'}
    ],
    [
        'msword',
        {text: 'MS-Word'}
    ],
    // [
    //     'narrator',
    //     {text: 'Narrator'}
    // ]
])

export default taughtAppMap;

export const taughtAppList = Array.from(taughtAppMap.values());
