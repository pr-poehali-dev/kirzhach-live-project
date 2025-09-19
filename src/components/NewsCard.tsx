import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  time: string;
  author: string;
  category: string;
  comments: Comment[];
}

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(news.comments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: 'Аноним',
        text: newComment,
        time: 'только что'
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <Card className="w-full mb-4 animate-fade-in hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {news.category}
          </span>
          <span className="text-xs text-muted-foreground">{news.time}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground leading-tight">
          {news.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-3">
          {showFullContent ? news.content : news.summary}
        </p>
        
        {news.content !== news.summary && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-primary p-0 h-auto font-normal"
          >
            {showFullContent ? 'Скрыть' : 'Читать далее'}
          </Button>
        )}

        <div className="flex items-center mt-3 text-xs text-muted-foreground">
          <Icon name="User" size={14} className="mr-1" />
          <span>{news.author}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-3 flex-col">
        <div className="flex items-center justify-between w-full mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="MessageCircle" size={16} className="mr-1" />
            Комментарии ({comments.length})
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Icon name="Share2" size={16} className="mr-1" />
              Поделиться
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="w-full space-y-3 animate-slide-up">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {comment.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-sm text-foreground">{comment.text}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Textarea
                placeholder="Написать комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 min-h-[80px] resize-none"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="self-end"
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}