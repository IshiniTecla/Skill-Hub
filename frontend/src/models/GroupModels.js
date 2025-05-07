// Group model
export class Group {
    constructor(data = {}) {
      this.id = data.id || '';
      this.name = data.name || '';
      this.description = data.description || '';
      this.ownerId = data.ownerId || '';
      this.adminId = data.adminId || '';
      this.members = data.members || [];
    }
  }
  
  // Group Message model
  export class GroupMessage {
    constructor(data = {}) {
      this.id = data.id || '';
      this.groupId = data.groupId || '';
      this.userId = data.userId || '';
      this.senderName = data.senderName || '';
      this.content = data.content || '';
      this.timestamp = data.timestamp || Date.now();
      this.createdAt = data.createdAt || new Date().toISOString();
    }
  }
  
  // Group Post model
  export class GroupPost {
    constructor(data = {}) {
      this.id = data.id || '';
      this.groupId = data.groupId || '';
      this.postedByUserId = data.postedByUserId || '';
      this.postedByUsername = data.postedByUsername || '';
      this.text = data.text || '';
      this.content = data.content || '';
      this.mediaUrl = data.mediaUrl || null;
      this.createdAt = data.createdAt || new Date().toISOString();
    }
  }