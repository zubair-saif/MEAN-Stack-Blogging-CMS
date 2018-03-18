import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PostalService } from 'app/services/postal.service';
import { Post } from 'app/models/post.model';
import { ChunkService } from 'app/services/chunk.service';
import { Chunk } from 'app/models/chunk.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  private sub: any;
  post: Post;
  chunks: Chunk[];

  types = [
    "text",
    "code",
    "image",
    "video"
  ];
  categories = [
    "design",
    "development",
    "travel",
    "motorcycles"
  ];
  selectedCategory:string = undefined;

  constructor(
    private route: ActivatedRoute,
    private postalService: PostalService,
    private chunkService: ChunkService
  ) { }

  ngOnInit() {
    // Subscribe to the search Params and pass them to getPostByURL() to return post data
    this.sub = this.route.params.subscribe( params => {
      this.postalService.getPostByID(params._id).subscribe( data => {
        this.post = data;
        if(data.category!==undefined){
          this.selectedCategory = data.category;
        }
        if(data.chunks.length>=1){
          this.getAllChunks();
        }
      });
    });
  }

  editPostMeta(){
    if(!this.post.category){
      this.post.category=this.selectedCategory;
    }
    this.postalService.updatePostMeta(this.post).subscribe( data => {
      console.log(data);
    });
  }

  newChunk(){
    this.chunkService.createChunk().subscribe(data=>{
     // this.post.chunks.push(data._id);
      console.log('todo');
      console.log(data);
      this.editPostMeta();
      this.getAllChunks();
    });
  }

  getAllChunks(){
    this.chunkService.getAllChunks(this.post.chunks).subscribe(data=>{
      // this.chunks = data.newChunks;
      this.chunks = data;
    });
  }

  deleteChunk(id){
    // Delete from Chunk table
    this.chunkService.deleteChunk(id).subscribe(data=>{
      console.log(data);
    });
    // Delete from current post and chunks then update!
    let index = this.post.chunks.indexOf(id);
    this.chunks.splice(index,1);
    this.post.chunks.splice(index,1);
    this.editPostMeta();
    this.getAllChunks();
  }

  updateChunk(chunk){
    console.log(chunk);
    if( !('content' in chunk) ){ chunk.content='' }
    this.chunkService.updateChunk(chunk).subscribe(data=>{
      console.log(data);
    });
  }

  // Unsubscribe on leave
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}