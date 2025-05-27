
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    timeAgo: '2 months ago',
    avatarSrc: 'https://placehold.co/40x40.png',
    avatarFallback: 'PS',
    rating: 5,
    comment: 'I love how easy it is to find the best recharge plan for my needs. The recommendations are spot on!',
    likes: 12,
    dislikes: 2,
    avatarHint: 'woman face',
  },
  {
    name: 'Arjun Verma',
    timeAgo: '3 months ago',
    avatarSrc: 'https://placehold.co/40x40.png',
    avatarFallback: 'AV',
    rating: 4,
    comment: 'The comparison feature is very helpful. I can easily see the differences between plans and choose the best one.',
    likes: 8,
    dislikes: 1,
    avatarHint: 'man face',
  },
  {
    name: 'Divya Patel',
    timeAgo: '4 months ago',
    avatarSrc: 'https://placehold.co/40x40.png',
    avatarFallback: 'DP',
    rating: 5,
    comment: 'This website has saved me so much time and money. I always find the best deals here.',
    likes: 15,
    dislikes: 3,
    avatarHint: 'woman smiling',
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Our Users Say
          </h2>
        </div>
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                    <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{testimonial.name}</h3>
                      <p className="text-xs text-muted-foreground">{testimonial.timeAgo}</p>
                    </div>
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {testimonial.comment}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{testimonial.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-destructive">
                        <ThumbsDown className="h-4 w-4" />
                        <span>{testimonial.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
