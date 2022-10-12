const ScreenReaderMap = new Map([
    [
        'jaws',
        {value:'jaws',text: 'JAWS'}
    ],
    [
        'nvda',
        {value:'nvda',text: 'NVDA'}
    ], 
    [
        'narrator',
        {value:'narrator',text: 'Narrator'}
    ]
])

export default ScreenReaderMap;

export const ScreenReaderList = Array.from(ScreenReaderMap.values());