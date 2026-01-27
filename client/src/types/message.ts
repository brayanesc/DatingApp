export type Message = {
  id: string;
  senderId: string;
  senderDisplayName: string;
  senderImageUrl: string;
  recipientId: string;
  recipientDisplayName: string;
  recipientImageUrl: string;
  content: string;
  dateRead?: any;
  messageSent: string;
  currentUserSender?: boolean;
};

export class MessageParams {
  container: string = 'Inbox';
  pageNumber = 1;
  pageSize = 10;
}
