import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message, MessageParams } from '../../types/message';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMessages(messageParams: MessageParams) {
    let params = new HttpParams();

    params = params.append('pageNumber', messageParams.pageNumber);
    params = params.append('pageSize', messageParams.pageSize);
    params = params.append('container', messageParams.container);

    return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'messages', { params });
  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + memberId);
  }

  sendMessage(recipientId: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', { recipientId, content });
  }

  deleteMessage(id: string) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
