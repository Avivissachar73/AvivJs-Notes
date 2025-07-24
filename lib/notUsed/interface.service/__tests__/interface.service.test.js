const { validateType, Enumerator, Range, MultiType, generateItemFromInterface } = require('../index');

describe('test the type validation service', () => {

    const HobyInterface = {
        type: String,
        level: MultiType(Number, Enumerator('beginner', 'medium', 'expert'))
    }

    const PersonInterface = {
        name: String,
        age: Range(0, 120),
        birthDate: Date,
        adress: {
            city: Enumerator('Jerusalem', 'Tel Aviv')
        },
        isHappy: Boolean,
        hobies: [HobyInterface, 2]
    }


    it('should successfullt validate', () => {
        const person = {
            name: 'Aviv',
            age: 22,
            birthDate: new Date(Date.now() - (1000 * 60 * 60 * 24 * 365 * 7)),
            adress: {
                city: 'Jerusalem'
            },
            isHappy: true,
            hobies: [
                {
                    type: 'sport',
                    level: 17
                },
                {
                    type: 'music',
                    level: 84
                },
            ]
        }
        const res = validateType(PersonInterface, person, false, false, true, true, 'Person');
        expect(res).toBe(true);
    });

    it('should fail validationg', () => {
        const person = {
            name: 'Yovel',
            age: 121
        }
        const res = validateType(PersonInterface, person);
        expect(res).toBe(false);
    });

    it('should generate item and successfully validate it', () => {
        const person = generateItemFromInterface(PersonInterface, true, 1);
        // console.log(JSON.stringify(person, null, 2));
        const res = validateType(PersonInterface, person);
        expect(res).toBe(true);
    });
});