import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../core/services/message-service';
import { Message, MessageParams } from '../../types/message';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';
import { TimeAgoPipe } from '../../core/pipes/time-ago-pipe';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmDialogService } from '../../core/services/confirm-dialog-service';

@Component({
  selector: 'app-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  private messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmDialogService);

  protected messageParams = new MessageParams();
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);
  protected fetchedContainer = 'Inbox';

  tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Outbox', value: 'Outbox' },
  ];

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.messageParams).subscribe({
      next: (response) => {
        this.paginatedMessages.set(response);
        this.fetchedContainer = this.messageParams.container;
      },
    });
  }

  async confirmDelete(event: Event, id: string) {
    event.stopPropagation();
    const ok = await this.confirmDialogService.confirm(
      'Are you sure you want to delete this message?',
    );
    if (ok) this.deleteMessage(id);
  }

  deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        const current = this.paginatedMessages();
        if (current?.items) {
          this.paginatedMessages.update((prev) => {
            if (!prev) return null;

            const newItems = prev.items.filter((x) => x.id !== id) || [];
            // const newMetadata = prev.metadata ? {
            //    ...prev.metadata, totalCount: calculate, pageSize: calculate
            // }

            return {
              items: newItems,
              metadata: prev.metadata,
            };
          });
        }
      },
    });
  }

  get isInbox() {
    return this.fetchedContainer === 'Inbox';
  }

  setContainer(container: string) {
    this.messageParams.container = container;
    this.messageParams.pageNumber = 1;
    this.loadMessages();
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.messageParams.pageNumber = event.pageNumber;
    this.messageParams.pageSize = event.pageSize;
    this.loadMessages();
  }
}
