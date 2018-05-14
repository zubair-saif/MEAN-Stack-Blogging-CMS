import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostalService } from '../../services/postal.service';
import { Feature } from '../../models/feature.model';

@Component({

    selector: 'app-home',

    templateUrl: './home.component.html',

    styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {

    featured: Feature[];

    events: any;

    date_start: number;

    date_end: number;

    constructor(

        private postalService: PostalService

    ) {}

    parse(upload: string): string {

        return 'http://localhost:3000'+upload.substring(1);

    }

    listmymovies(){

        const mymovies = [
            "Jaws",
            "Moulin Rouge",
            "The Notebook"
        ]

        return mymovies;

    }

    ngOnInit() {

        // Get Posts

        this.getPosts();

    }

    getPosts(): void {

        const params = {

            active: 'true',

            limit: '4',
            
            select: ['url', 'hero', 'title', 'date'],
            
            categories: ['design', 'development'],

        };

        this.postalService.getPosts(params).subscribe( data => {
            
            this.featured = data;

        });

    }

}
