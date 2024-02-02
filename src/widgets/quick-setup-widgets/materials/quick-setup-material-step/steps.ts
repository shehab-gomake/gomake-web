export interface IQuickSetupMaterialsStep {
    stepTitle: string;
    parameters: IMaterialStepParameter[];
}

export interface IMaterialStepParameter {
    parameterKey: string;
    label: string;

}

const quickSetupMaterialSteps = (step: string): IQuickSetupMaterialsStep => {
    switch (step) {
        case '1':
            return {
                stepTitle: 'Some of Your Laibels Materials!',
                parameters: [
                    {
                    parameterKey: 'coatedPaper170',
                    label: 'coatedPaper170'
                },  {
                    parameterKey: 'uncoated300',
                    label: 'uncoated300'
                },  {
                    parameterKey: 'laminationMatt',
                    label: 'laminationMatt'
                },  {
                    parameterKey: 'PPStickers',
                    label: 'PPStickers'
                },
                ],
            }
            case '2':
            return {
                stepTitle: 'Some of Your Laibels Materials!',
                parameters: [
                    {
                    parameterKey: 'coatedPaper170',
                    label: 'coatedPaper170'
                },  {
                    parameterKey: 'uncoated300',
                    label: 'uncoated300'
                },  {
                    parameterKey: 'foilGold',
                    label: 'foilGold'
                },  {
                    parameterKey: 'core382',
                    label: 'core382'
                },
                ],
            }
            case '3':
            return {
                stepTitle: 'Some of Your Laibels Materials!',
                parameters: [
                    {
                    parameterKey: 'PVC1222443',
                    label: 'PVC1222443'
                },  {
                    parameterKey: 'wightVinvy',
                    label: 'wightVinvy'
                },  {
                    parameterKey: 'paperApplication',
                    label: 'paperApplication'
                },  {
                    parameterKey: 'redColor',
                    label: 'redColor'
                },
                ],
            }
        default: {}
    }
}
export {quickSetupMaterialSteps}