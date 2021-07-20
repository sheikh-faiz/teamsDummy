import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { miscellaneousConst } from '@app/shared/const/miscellaneous.const';

@Component({
  selector: 'app-test-list-public',
  templateUrl: './test-list-public.component.html',
})
export class TestListPublicComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  public Id = '';
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.Id = params.id;
    });
    this.route.queryParams.subscribe((params) => {
      const { regUniqueName } = params;
      const navigationExtras: NavigationExtras = {
        queryParams: { regUniqueName },
      };
      setTimeout(() => {
        this.router.navigate([`${miscellaneousConst.navigation.tests}/${this.Id}/${miscellaneousConst.navigation.detail}`],
        navigationExtras);
      }, 1000);
    });
  }
}
