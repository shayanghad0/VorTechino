import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api, Category } from '../lib/api'
import { Search, BookOpen, User, LogOut, Shield, Bookmark, Bell, Settings, HelpCircle, FileText, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [subjects, setSubjects] = useState<Category[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get<{ categories: Category[] }>('/categories')
      .then(res => setSubjects(res.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-border bg-background/90 backdrop-blur-xl shadow-lg shadow-black/20' : 'border-border/50 bg-background/70 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* Left side */}
          <div className="flex items-center gap-6">
            {/* Mobile menu */}
            <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden size-8">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12H20" />
                    <path d="M4 6H20" />
                    <path d="M4 18H20" />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-2 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0">
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink asChild>
                        <Link to="/lessons" className="block py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => setMobileOpen(false)}>
                          Lessons
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    {subjects.map(cat => (
                      <NavigationMenuItem key={cat.id} className="w-full">
                        <NavigationMenuLink asChild>
                          <Link to={`/category/${cat.slug}`} className="block py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => setMobileOpen(false)}>
                            {cat.name}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
                <Separator className="my-2" />
                <form onSubmit={handleSearch} className="px-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search lessons..."
                      className="pl-9 h-9"
                    />
                  </div>
                </form>
              </PopoverContent>
            </Popover>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground hidden sm:block tracking-tight">Trading Academy</span>
            </Link>

            {/* Desktop nav */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className="py-1.5 font-medium text-muted-foreground hover:text-foreground">
                    <Link to="/lessons">Lessons</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {subjects.slice(0, 4).map(cat => (
                  <NavigationMenuItem key={cat.id}>
                    <NavigationMenuLink asChild className="py-1.5 font-medium text-muted-foreground hover:text-foreground">
                      <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                {subjects.length > 4 && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className="py-1.5 font-medium text-muted-foreground hover:text-foreground">
                      <Link to="/lessons">+{subjects.length - 4} more</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search lessons..."
                className="pl-9 h-9 bg-muted/50"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 relative">
                      <Bell className="h-4 w-4" />
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">
                        0
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      Notifications
                      <Badge variant="secondary" className="ml-2 text-[10px]">New</Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex-col items-start p-3 cursor-default">
                      <div className="flex w-full items-center justify-between">
                        <span className="font-medium text-sm">Welcome back!</span>
                        <span className="text-xs text-muted-foreground">Just now</span>
                      </div>
                      <span className="text-sm text-muted-foreground mt-1">
                        Continue learning where you left off
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="justify-center text-center cursor-pointer">
                      <Link to="/lessons">View all lessons</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 rounded-full">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {isAdmin ? 'Administrator' : 'Member'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/bookmarks"><Bookmark className="mr-2 h-4 w-4" /> Bookmarks</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/admin"><Shield className="mr-2 h-4 w-4" /> Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
