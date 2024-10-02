import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  ChevronDown,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

function Post({ post, onUpvote, onDownvote, onBookmark }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>By {post.author}</CardDescription>
      </CardHeader>
      <CardContent>{post.content.slice(0, 100)}...</CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-200 rounded px-2 py-1">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => onUpvote(post.id)}>
            <ThumbsUp className="mr-2" /> {post.upvotes}
          </Button>
          <Button variant="ghost" onClick={() => onDownvote(post.id)}>
            <ThumbsDown className="mr-2" /> {post.downvotes}
          </Button>
          <Button variant="ghost" onClick={() => onBookmark(post.id)}>
            <Bookmark />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function Sidebar() {
  const links = ["Home", "Explore", "Bookmarks", "Profile"];
  return (
    <div className="w-64 hidden sm:block">
      {links.map((link) => (
        <div key={link} className="p-2 hover:bg-gray-100 cursor-pointer">
          {link}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    // Mock fetching posts
    setPosts([
      {
        id: 1,
        title: "First Post",
        content: "This is the first discussion post.",
        author: "Alice",
        tags: ["tech", "ai"],
        upvotes: 10,
        downvotes: 2,
      },
      {
        id: 2,
        title: "Second Post",
        content: "Exploring new frameworks.",
        author: "Bob",
        tags: ["webdev", "react"],
        upvotes: 5,
        downvotes: 0,
      },
    ]);
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
    setIsDialogOpen(false);
  };

  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "latest") return b.id - a.id;
      if (sortBy === "mostVoted")
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      return 0;
    });

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ChevronDown className="mr-2" /> Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("latest")}>
                Latest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("mostVoted")}>
                Most Voted
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2" /> New Post
          </Button>
        </div>
        {filteredPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onUpvote={() => console.log("Upvote", post.id)}
            onDownvote={() => console.log("Downvote", post.id)}
            onBookmark={() => console.log("Bookmark", post.id)}
          />
        ))}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Fill in the details for your post.
              </DialogDescription>
            </DialogHeader>
            <Input placeholder="Title" className="mb-2" />
            <Input placeholder="Content" className="mb-2" />
            <Input placeholder="Tags (comma separated)" />
            <DialogFooter>
              <Button
                type="submit"
                onClick={() =>
                  handleNewPost({
                    id: Date.now(),
                    title: "New Post",
                    content: "New content",
                    author: "Current User",
                    tags: ["new"],
                    upvotes: 0,
                    downvotes: 0,
                  })
                }
              >
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
