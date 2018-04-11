import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-html',
    templateUrl: './html.component.html'
})
export class HtmlComponent implements OnInit {

    @Input() node;

    constructor() { }

    ngOnInit() {
        console.log(this.node);
    }

}
