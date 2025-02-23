# ImportPagesCSV: Import CSV file to pages

This is a ProcessWire module that enables you to import CSV files to create pages
or modify existing pages. This admin/development tool is recommended only for use by the 
superuser or developer. 

The following Fieldtypes are supported for importing, as well as most types 
derived from them: 

- Checkbox
- Datetime
- Email
- File
- Float
- Image
- Integer
- Options
- Page
- PageTitle
- Text
- Textarea
- URL
- Password

## To install:

1. Place the module files in a /site/modules/ImportPagesFromCSV/ directory. 
2. In ProcessWire admin, click on 'Modules' and 'Check for new modules'. 
3. Click 'Install' next to the 'Import Pages From CSV' module. 

Once installed, the module can be found on your admin Setup menu under the title "Import Pages From CSV". 

## Usage

Select the template and parent under which new pages will be created. Select the CSV file or enter
the data in the textarea field at the bottom. The first line/row in the CSV file is considered as a
header and must contain column names. Specify the delimiter and enclosure used in the CSV file. Enter the
maximum number of rows to import from the CSV file (useful for testing). Batch size value represents
the number of rows that will be processed in one go. This is to avoid timeouts and memory limits. 

## Importing file/image fields

The CSV column should contain the full URL (or diskpath and filename) to the file you want to import. 
For fields that support multiple files, place each filename or URL on its own line, OR separate 
them by | (pipe) OR tab.

## Importing page reference fields

For single-value page fields, the CSV imported value can be the page id, path, title, or name.
For multi-value page fields, the value can be the same, but multiple values should be separated by 
either a newline in the column or a pipe "|" character. Please ensure that your Page reference 
field has one or more pages selected for the "Parent" setting on the Details tab. If you want the 
import to be able to create pages, there must also be a single Template selected on the "Template" 
setting. 


---
Copyright 2011-2021 by Ryan Cramer for ProcessWire
Copyright 2023 by Matjaž Potočnik, forked and modified https://github.com/ryancramerdesign/ImportPagesCSV
