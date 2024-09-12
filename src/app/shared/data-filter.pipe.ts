import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter',
  standalone: true,
})
export class DataFilterPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if (!value) return [];
    if (!args) return value;

    args = args.toLowerCase();

    return value.filter((item: any) => {
      return item['product_name'].toLowerCase().includes(args); // Adjust according to the field you want to filter by
    });

    // return value.filter((val: any) => {
    //       return val.product_name == args[0];
    //     });
  }
}
