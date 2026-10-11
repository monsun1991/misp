export interface WhatsAppConversation {
  id: string;
  recipient?: string;
  recipientName: string;
  recipientType?: string;
  messageContent: string;
  messageType: string;
  updatedAt: Date | string;
  status: string;
  isIncoming?: boolean;
  media?: any;
  modelType?: 'contact' | 'lead';
  modelId?: string;
  refId?: string | number;
  template_name?: string;
  payload?: any;
}

export interface WhatsAppChat {
  id: string;
  whatsappMessageId?: string;
  message_id?: string;
  messageType: string;
  messageContent: string;
  createdAt: Date | string;
  status: string;
  isIncoming?: boolean;
  media?: any;
  replied_to_message_id?: string;
  recipientName?: string;
  payload?: any;
}


