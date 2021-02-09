import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.css']
})
export class ComponentListComponent implements OnInit {
  @Input() posts;
  @Input() identity;
  @Input() url;

  constructor() { }

  ngOnInit(): void {
  }

}
 