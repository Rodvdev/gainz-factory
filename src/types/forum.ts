export interface Forum {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
  topics?: ForumTopic[]
  _count?: {
    topics: number
  }
}

export interface ForumTopic {
  id: string
  title: string
  content: string
  isPinned: boolean
  isLocked: boolean
  isActive: boolean
  authorId: string
  forumId: string
  views: number
  likes: number
  lastReplyAt?: string
  lastReplyBy?: string
  createdAt: string
  updatedAt: string
  author?: {
    firstName: string
    lastName: string
    profileImageUrl?: string
  }
  forum?: {
    name: string
    slug: string
  }
  replies?: ForumReply[]
  _count?: {
    replies: number
  }
}

export interface ForumReply {
  id: string
  content: string
  isSolution: boolean
  authorId: string
  topicId: string
  parentId?: string
  createdAt: string
  updatedAt: string
  author?: {
    firstName: string
    lastName: string
    profileImageUrl?: string
  }
  topic?: {
    title: string
    forum: {
      name: string
    }
  }
  parent?: {
    id: string
    content: string
    author: {
      firstName: string
      lastName: string
    }
  }
  replies?: ForumReply[]
}

export interface CreateForumData {
  name: string
  description?: string
  icon?: string
  color?: string
  isActive?: boolean
  order?: number
}

export interface UpdateForumData extends Partial<CreateForumData> {
  id: string
}

export interface CreateTopicData {
  title: string
  content: string
  forumId: string
  isPinned?: boolean
  isLocked?: boolean
  isActive?: boolean
}

export interface UpdateTopicData extends Partial<Omit<CreateTopicData, 'forumId'>> {
  id: string
}

export interface CreateReplyData {
  content: string
  topicId: string
  parentId?: string
  isSolution?: boolean
}

export interface UpdateReplyData extends Partial<Omit<CreateReplyData, 'topicId'>> {
  id: string
}

export interface ForumFilters {
  search?: string
  category?: string
  isActive?: boolean
  isPinned?: boolean
  isLocked?: boolean
}

export interface ForumStats {
  totalForums: number
  totalTopics: number
  totalReplies: number
  activeForums: number
  pinnedTopics: number
  recentActivity: {
    topics: ForumTopic[]
    replies: ForumReply[]
  }
}
