# AI Column Extraction Feature
Documentation for AI-powered text extraction and transformation functionality

## Overview
The AI Column Extraction feature allows users to create new columns by processing existing text data using AI language models. Users can extract specific information, transform content, or generate new insights based on source text.

## Demo Video

https://github.com/user-attachments/assets/aed38ce9-d884-4146-a82e-a761a13fed20

## Configuration

### Basic Settings
1. New Column Name: Define the name for the column that will store the AI-generated results
2. LLM Provider: Select the configured AI provider with pre-defined parameters - Model, Server URL, Temperature, Max Tokens
3. Response Format: Choose the output structure

| Response format  | Description |
|-------------|------------|
 | `Text |  Plain text response | 
 | `JSON Schema |  Structured response following a defined schema | 
 | `JSON Object |  Free-form JSON response | 

### Input Configuration

1. Description: Detailed instructions for the AI model about the desired extraction or transformation
2. JSON Schema (Optional): Required when Response Format is set to JSON Schema. Defines the structure and validation rules for the output

#### JSON Schema generator tools
1. [Liquid Technologies JSON to Schema converter](https://www.liquid-technologies.com/online-json-to-schema-converter)
2. [jsonschema.net](http://www.jsonschema.net)
3. [easy-json-schema.github.io](https://easy-json-schema.github.io)

Note: There are few manual edits that may be required. Refer to the JSON schema in the example below.

### Preview Function

Shows sample processing using the first row of data
Displays:
1. Input Value: Original text from source column
2. Response: AI-generated result based on configuration

Allows validation before processing entire dataset

## Examples

### Text Response Examples
| Use Case | Instruction |
|-------------|------------|
| Basic Summary | Generate a one-sentence summary of the input text |
| Language Translation | Translate the text to German |

### JSON Schema Examples
| Use Case | Instruction | JSON Schema |
|-------------|------------|------------|
| Person information extraction | Extract in JSON format details of the person mentioned in the content | ``` { "name": "individual_schema", "schema": { "type": "object", "properties": { "name": { "type": "string", "description": "The name of the individual." }, "dateofbirth": { "type": "string", "description": "The date of birth of the individual." }, "placeofbirth": { "type": "string", "description": "The place where the individual was born." }, "dateofdeath": { "type": "string", "description": "The date of death of the individual." }, "placeofdeath": { "type": "string", "description": "The place where the individual died." } }, "required": [ "name", "dateofbirth", "placeofbirth", "dateofdeath", "placeofdeath" ], "additionalProperties": false }, "strict": true }``` |

### JSON object examples

| Use Case | Instruction |
|-------------|------------|
| Content classification | Classify the content and extract key entities, the response should be in JSON format |

## Use Cases

### Content Transformation

1. Summarization
2. Translation
3. Style conversion
4. Format standardization


### Information Extraction

1. Entity recognition
2. Key fact extraction
3. Timeline creation
4. Relationship mapping


### Content Analysis

1. Sentiment analysis
2. Theme identification
3. Category classification
4. Key concept extraction
