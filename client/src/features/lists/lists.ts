import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from '../members/member-card/member-card';
import { LikeParams } from '../../types/like';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);

  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected likeParams = new LikeParams();

  tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked me', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' },
  ];

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    if (this.likeParams.predicate !== predicate) {
      this.likeParams.predicate = predicate;
      this.likeParams.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.likeParams).subscribe({
      next: (result) => this.paginatedMembers.set(result),
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.likeParams.pageNumber = event.pageNumber;
    this.likeParams.pageSize = event.pageSize;
    this.loadLikes();
  }
}
