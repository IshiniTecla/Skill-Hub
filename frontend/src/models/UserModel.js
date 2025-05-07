// src/models/UserModel.js
class UserModel {
    constructor(data = {}) {
      this.id = data.id || '';
      this.username = data.username || '';
      this.email = data.email || '';
      this.firstName = data.firstName || '';
      this.lastName = data.lastName || '';
      this.bio = data.bio || '';
      this.profileImage = data.profileImage || null;
      this.followers = data.followers || [];
      this.following = data.following || [];
    }
  
    get fullName() {
      return `${this.firstName} ${this.lastName}`.trim();
    }
  
    get initials() {
      return ((this.firstName ? this.firstName[0] : '') + (this.lastName ? this.lastName[0] : '')).toUpperCase();
    }
  
    get followersCount() {
      return this.followers.length;
    }
  
    get followingCount() {
      return this.following.length;
    }
  
    toJSON() {
      return {
        id: this.id,
        username: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        bio: this.bio,
        followers: this.followers,
        following: this.following
      };
    }
  }
  
  export default UserModel;