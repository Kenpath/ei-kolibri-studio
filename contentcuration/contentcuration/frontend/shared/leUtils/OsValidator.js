const OsValidatorMap = new Map([
    [
        'windows',
        {value: 'windows', text: 'Windows'}
    ],
    [
        'linux',
        {value: 'linux', text: 'Linux'},
    ]
])

export default OsValidatorMap;

export const OsValidatorList = Array.from(OsValidatorMap.values());