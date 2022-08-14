import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tweet } from './model/tweet';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(environment.ApiUrl + '/users/all');
  }

  getUsersByUsername(username: string) {
    return this.http.get(environment.ApiUrl + `/user/search/${username}`);
  }

  getAllTweetsByUsername(username: string) {
    return this.http.get(environment.ApiUrl + `/${username}`);
  }

  getAllTweets() {
    return this.http.get(environment.ApiUrl + '/all');
  }

  postTweet(tweet: Tweet, username: string) {
    return this.http.post(environment.ApiUrl + `/${username}/add`, tweet);
  }

  likeTweet(tweetId: string, username: string) {
    return this.http.put(
      environment.ApiUrl + `/${username}/like/${tweetId}`,
      null
    );
  }

  deleteTweet(tweetId: string, username: string) {
    return this.http.delete(
      environment.ApiUrl + `/${username}/delete/${tweetId}`
    );
  }

  updateTweet(tweet: Tweet, username: string) {
    return this.http.put(
      environment.ApiUrl + `/${username}/update/${tweet.id}`,
      tweet
    );
  }

  replyTweet(tweetId: string, tweet: Tweet, username: string) {
    return this.http.post(
      environment.ApiUrl + `/${username}/reply/${tweetId}`,
      tweet
    );
  }
}
