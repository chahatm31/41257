import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const initialPosts = [
  {
    id: 1,
    title: "First Post",
    author: "John Doe",
    content: "This is a preview of the post content.",
    tags: ["tech", "discussion"],
    upvotes: 10,
    comments: 2,
  },
  // Add more dummy posts here
];

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" });

  const handleUpvote = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
  };

  const handleNewPost = () => {
    setDialogOpen(true);
  };

  const submitPost = () => {
    setPosts([
      ...posts,
      {
        ...newPost,
        id: posts.length + 1,
        upvotes: 0,
        comments: 0,
        tags: newPost.tags.split(",").map((tag) => tag.trim()),
      },
    ]);
    setDialogOpen(false);
    setNewPost({ title: "", content: "", tags: "" });
  };

  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "latest") return b.id - a.id;
      if (sortBy === "mostVoted") return b.upvotes - a.upvotes;
      // 'mostCommented' would go here if needed
    });

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <nav className="bg-gray-100 p-4 w-full md:w-1/5">
        <ul>
          <li className="py-2 cursor-pointer hover:bg-gray-200">Home</li>
          <li className="py-2 cursor-pointer hover:bg-gray-200">Explore</li>
          <li className="py-2 cursor-pointer hover:bg-gray-200">Bookmarks</li>
          <li className="py-2 cursor-pointer hover:bg-gray-200">Profile</li>
        </ul>
      </nav>
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select onValueChange={setSortBy} defaultValue={sortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="mostVoted">Most Voted</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleNewPost}>New Post</Button>
        </div>
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onUpvote={handleUpvote} />
        ))}
      </main>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              placeholder="Title"
            />
            <Textarea
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              placeholder="Content"
            />
            <Input
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              placeholder="Tags (comma separated)"
            />
          </div>
          <DialogFooter>
            <Button onClick={submitPost}>Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PostCard({ post, onUpvote }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>by {post.author}</CardDescription>
      </CardHeader>
      <CardContent>{post.content}</CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {post.tags.map((tag) => (
            <span key={tag} className="mr-2 text-sm bg-gray-200 p-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <div>
          <Button variant="outline" onClick={() => onUpvote(post.id)}>
            Upvote {post.upvotes}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
