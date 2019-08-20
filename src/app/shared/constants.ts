export class Constants {
    public static VALIDATION_MESSAGE = {
        'title': [
                { type: 'required', message: 'Summary is required.' },
                { type: 'maxlength', message: 'Summary cannot be more than 255 characters long.' }
            ],
            'location': [
                { type: 'required', message: 'Location is required.' },
                { type: 'maxlength', message: 'Location cannot be more than 255 characters long.' }
            ],
            'startTime': [
                { type: 'required', message: 'Start Date is required.' }
            ],
            'endTime': [
                { type: 'required', message: 'End Date is required.' }
            ],
        }
 }