const OsValidatorMap = new Map([
    [
        'windows',
        {text: 'Windows'}
    ],
    [
        'linux',
        {text: 'Linux'},
    ]
])

export default OsValidatorMap;

export const OsValidatorList = Array.from(OsValidatorMap.values());