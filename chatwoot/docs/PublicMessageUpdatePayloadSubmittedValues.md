# PublicMessageUpdatePayloadSubmittedValues

Replies to the Bot Message Types

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The name of the submiitted value | [optional] [default to undefined]
**title** | **string** | The title of the submitted value | [optional] [default to undefined]
**value** | **string** | The value of the submitted value | [optional] [default to undefined]
**csat_survey_response** | [**PublicMessageUpdatePayloadSubmittedValuesCsatSurveyResponse**](PublicMessageUpdatePayloadSubmittedValuesCsatSurveyResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PublicMessageUpdatePayloadSubmittedValues } from './api';

const instance: PublicMessageUpdatePayloadSubmittedValues = {
    name,
    title,
    value,
    csat_survey_response,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
