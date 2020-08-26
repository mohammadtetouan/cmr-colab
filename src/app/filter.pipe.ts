import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, fieldName: string, subFieldName: string): any[] {

    // return empty array if array is falsy
    if (!items) { return []; }

    // return the original array if search text is empty
    if (!searchText) { return items; }

    // convert the searchText to lower case
    searchText = searchText.toLowerCase();
    console.log('searchText', searchText, 'items', items);
    // retrun the filtered array
    return items.filter(item => {
      if (item && item[fieldName]) {
        // return item[fieldName][subFieldName].toLowerCase().includes(searchText);
        // return item[fieldName].filter(element => {
        //   element.toLowerCase().includes(searchText);
        // });
        return Object.values(item[fieldName]).find( (value: string) => {
          console.log('value', value);
          if (value && typeof value.valueOf() === 'string') {
            // s is a string
            console.log('value.toLowerCase().includes(searchText)', value.toLowerCase().includes(searchText));
            return value.toLowerCase().includes(searchText) ? item : false;
          }
        });
      }
      return false;
    });
   }

}
