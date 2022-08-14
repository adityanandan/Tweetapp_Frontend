import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Tweet } from '../model/tweet';
import { User } from '../model/user';
import { TweetService } from '../tweet.service';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tweetForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  editSubmitted: boolean = false;
  replySubmitted: boolean = false;
  currentUser: User;
  tweetList: Tweet[] = [];
  replyTweetForm: FormGroup;
  editTweetForm: FormGroup;
  currentTweet: Tweet = {
    id: null,
    tweetInfo: null,
    postDate: null,
    likes: 0,
    user: null,
    replies: null,
    tweetTag: null,
  };
  addTagClicked: boolean = false;
  currentRouteUsername: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private tweetService: TweetService,
    private route: ActivatedRoute
    ) { 
      this.tweetForm = this.formBuilder.group({
      tweetBody: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(144)]],
      tweetTag: ['', Validators.maxLength(50)],
    });
    this.replyTweetForm = this.formBuilder.group({
      tweetBody: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(144)]],
      tweetTag: ['', Validators.maxLength(50)],
    });
    this.editTweetForm = this.formBuilder.group({
      tweetBody: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(144)]],
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('login');
    }
    this.currentUser = this.authService.getCurrentUser();
    this.currentRouteUsername = this.route.snapshot.paramMap.get('username');
    if (this.currentRouteUsername === null) {
      this.tweetService
        .getAllTweets()
        .subscribe((data: any) => {
          this.tweetList = data;
        });
    } else {
      this.tweetService
        .getAllTweetsByUsername(this.currentRouteUsername)
        .subscribe((data: any) => {
          this.tweetList = data;
        });
    }
  }

  get f() {
    return this.tweetForm.controls;
  }

  addTag() {
    this.addTagClicked = true;
  }

  removeTag() {
    this.addTagClicked = false;
  }

  likeTweet(tweetId: string) {
    this.tweetService
      .likeTweet(tweetId, this.currentUser.username)
      .subscribe((data: any) => {
        this.refreshTweets();
      });
  }

  deleteTweet(tweetId: string) {
    this.tweetService
      .deleteTweet(tweetId, this.currentUser.username)
      .subscribe((data: any) => this.refreshTweets());
  }

  openEditTweetPopup(tweet: Tweet) {
    this.currentTweet = tweet;
    $('#editModal').modal('show');
  }
  openReplyTweetPopup(tweet: Tweet) {
    this.currentTweet = tweet;
    $('#replyModal').modal('show');
  }
  editTweetSubmit() {
    this.editSubmitted = true;
    this.currentTweet.tweetInfo = this.editTweetForm.controls.tweetBody.value;
    this.tweetService
      .updateTweet(this.currentTweet, this.currentUser.username)
      .subscribe((data: any) => {
        this.refreshTweets();
        setTimeout(()=>{
          window.location.reload();
         },100);
        this.currentTweet = {
          id: null,
          tweetInfo: null,
          postDate: null,
          likes: 0,
          user: null,
          replies: null,
          tweetTag: null,
        };
        $('#editModal').modal('hide');
        this.addTagClicked = false;
      });
  }
  hideEditModal() {
    $('#editModal').modal('hide');
  }
  hideReplyModal(){
    $('#replyModal').modal('hide');
  }

  replyTweetSubmit() {
    this.replySubmitted = true;
    let now = new Date();
    let replyTweet: Tweet = {
      id: null,
      tweetInfo: this.replyTweetForm.controls.tweetBody.value,
      postDate: new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString(),
      likes: null,
      user: this.currentUser,
      replies: null,
      tweetTag: this.replyTweetForm.controls.tweetTag.value,
    };
    this.tweetService
      .replyTweet(this.currentTweet.id, replyTweet, this.currentUser.username)
      .subscribe((data: any) => {
        setTimeout(()=>{
          window.location.reload();
         },100);
        $('#replyModal').modal('hide');
        this.addTagClicked = false;
      });
  }

  refreshTweets() {
    this.tweetList.splice(0);
    if (this.currentRouteUsername === null) {
      this.tweetService.getAllTweets().subscribe((data: any) => {
        this.tweetList.push(...data);
      });
    } else {
      this.tweetService
        .getAllTweetsByUsername(this.currentRouteUsername)
        .subscribe((data: any) => {
          this.tweetList.push(...data);
        });
    }
    console.log(this.tweetList);
  }

  onSubmit() {
    this.submitted = true;
    if (this.tweetForm.invalid) {
      return;
    }
    this.loading = true;
    let tweet: Tweet = {
      id: null,
      tweetInfo: this.f.tweetBody.value,
      postDate: null,
      likes: 0,
      user: null,
      replies: null,
      tweetTag: this.f.tweetTag.value,
    };
    this.tweetService.postTweet(tweet, this.currentUser.username).subscribe(
      (data: any) => {
        if (data.id !== undefined) {
          this.refreshTweets();
          this.addTagClicked = false;
          setTimeout(()=>{
            window.location.reload();
           },200);
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
    console.log('x');
  }

  trackTweet(index: number, tweet: Tweet) {
    return tweet.id;
  }
}
