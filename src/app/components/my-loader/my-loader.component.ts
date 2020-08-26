// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-my-loader',
//   templateUrl: './my-loader.component.html',
//   styleUrls: ['./my-loader.component.scss'],
// })
// export class MyLoaderComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }

import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../generic/loader.service';

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.scss'],
})
export class MyLoaderComponent implements OnInit {

  loading: boolean;

  constructor(private loaderService: LoaderService) {

    this.loaderService.isLoading.subscribe((v) => {
      console.log('loading', v);
      this.loading = v;
    });

  }
  ngOnInit() {
  }

}