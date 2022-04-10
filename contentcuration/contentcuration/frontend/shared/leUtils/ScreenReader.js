const ScreenReaderMap = new Map([
    [
        'jaws',
        {text: 'JAWS'}
    ],
    [
        'nvda',
        {text: 'NVDA'}
    ], 
    [
        'narrator',
        {text: 'Narrator'}
    ]
])

export default ScreenReaderMap;

export const ScreenReaderList = Array.from(ScreenReaderMap.values());