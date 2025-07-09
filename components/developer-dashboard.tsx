"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Search, Check, Terminal, Code, AlertTriangle, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CodeSnippet {
  title: string
  description: string
  code: string
  language: string
  category: string
}

interface CommonError {
  title: string
  description: string
  error: string
  solution: string
  category: string
}

const shortcuts = [
  {
    title: "VS Code Shortcuts",
    items: [
      { key: "Ctrl + Shift + P", description: "Command Palette" },
      { key: "Ctrl + `", description: "Toggle Terminal" },
      { key: "Ctrl + Shift + `", description: "New Terminal" },
      { key: "Ctrl + B", description: "Toggle Sidebar" },
      { key: "Ctrl + Shift + E", description: "Explorer" },
      { key: "Ctrl + Shift + F", description: "Search" },
      { key: "Ctrl + Shift + G", description: "Source Control" },
      { key: "Alt + Up/Down", description: "Move Line" },
      { key: "Shift + Alt + Up/Down", description: "Copy Line" },
      { key: "Ctrl + /", description: "Toggle Comment" },
    ],
  },
  {
    title: "Browser DevTools",
    items: [
      { key: "F12", description: "Open DevTools" },
      { key: "Ctrl + Shift + I", description: "Open DevTools" },
      { key: "Ctrl + Shift + C", description: "Inspect Element" },
      { key: "Ctrl + Shift + J", description: "Console" },
      { key: "Ctrl + R", description: "Refresh" },
      { key: "Ctrl + Shift + R", description: "Hard Refresh" },
      { key: "Ctrl + Shift + Delete", description: "Clear Storage" },
    ],
  },
  {
    title: "System Shortcuts",
    items: [
      { key: "Ctrl + C", description: "Copy" },
      { key: "Ctrl + V", description: "Paste" },
      { key: "Ctrl + Z", description: "Undo" },
      { key: "Ctrl + Y", description: "Redo" },
      { key: "Ctrl + A", description: "Select All" },
      { key: "Ctrl + S", description: "Save" },
      { key: "Alt + Tab", description: "Switch Apps" },
      { key: "Windows + L", description: "Lock Screen" },
    ],
  },
]

const gitCommands = [
  {
    title: "Basic Commands",
    commands: [
      { command: "git init", description: "Initialize a new Git repository" },
      { command: "git clone <url>", description: "Clone a repository" },
      { command: "git status", description: "Check repository status" },
      { command: "git add .", description: "Stage all changes" },
      { command: "git add <file>", description: "Stage specific file" },
      { command: "git commit -m 'message'", description: "Commit changes" },
      { command: "git commit -am 'message'", description: "Stage and commit all changes" },
      { command: "git push", description: "Push to remote repository" },
      { command: "git push origin <branch>", description: "Push specific branch" },
      { command: "git pull", description: "Pull from remote repository" },
      { command: "git fetch", description: "Fetch changes without merging" },
      { command: "git remote -v", description: "Show remote repositories" },
    ],
  },
  {
    title: "Branching & Merging",
    commands: [
      { command: "git branch", description: "List all branches" },
      { command: "git branch -a", description: "List all branches (local & remote)" },
      { command: "git branch <name>", description: "Create new branch" },
      { command: "git checkout <branch>", description: "Switch to branch" },
      { command: "git checkout -b <name>", description: "Create and switch to branch" },
      { command: "git switch <branch>", description: "Switch to branch (modern)" },
      { command: "git switch -c <name>", description: "Create and switch to branch (modern)" },
      { command: "git merge <branch>", description: "Merge branch into current" },
      { command: "git merge --no-ff <branch>", description: "Merge with merge commit" },
      { command: "git branch -d <name>", description: "Delete merged branch" },
      { command: "git branch -D <name>", description: "Force delete branch" },
      { command: "git push origin --delete <branch>", description: "Delete remote branch" },
    ],
  },
  {
    title: "History & Logs",
    commands: [
      { command: "git log", description: "View commit history" },
      { command: "git log --oneline", description: "Compact commit history" },
      { command: "git log --graph", description: "Show branch graph" },
      { command: "git log --author='name'", description: "Filter commits by author" },
      { command: "git log --since='2 weeks ago'", description: "Filter commits by date" },
      { command: "git show <commit>", description: "Show commit details" },
      { command: "git diff", description: "Show unstaged changes" },
      { command: "git diff --staged", description: "Show staged changes" },
      { command: "git diff <branch1>..<branch2>", description: "Compare branches" },
      { command: "git blame <file>", description: "Show who changed each line" },
    ],
  },
  {
    title: "Undoing Changes",
    commands: [
      { command: "git reset HEAD <file>", description: "Unstage file" },
      { command: "git reset --soft HEAD~1", description: "Undo last commit (keep changes)" },
      { command: "git reset --hard HEAD~1", description: "Undo last commit (discard changes)" },
      { command: "git reset --hard <commit>", description: "Reset to specific commit" },
      { command: "git checkout -- <file>", description: "Discard file changes" },
      { command: "git restore <file>", description: "Restore file (modern)" },
      { command: "git restore --staged <file>", description: "Unstage file (modern)" },
      { command: "git revert <commit>", description: "Create commit that undoes changes" },
      { command: "git clean -fd", description: "Remove untracked files and directories" },
    ],
  },
  {
    title: "Stashing",
    commands: [
      { command: "git stash", description: "Stash current changes" },
      { command: "git stash push -m 'message'", description: "Stash with message" },
      { command: "git stash list", description: "List all stashes" },
      { command: "git stash pop", description: "Apply and remove latest stash" },
      { command: "git stash apply", description: "Apply stash without removing" },
      { command: "git stash apply stash@{2}", description: "Apply specific stash" },
      { command: "git stash drop", description: "Delete latest stash" },
      { command: "git stash clear", description: "Delete all stashes" },
    ],
  },
  {
    title: "Advanced Operations",
    commands: [
      { command: "git rebase <branch>", description: "Rebase current branch" },
      { command: "git rebase -i HEAD~3", description: "Interactive rebase last 3 commits" },
      { command: "git cherry-pick <commit>", description: "Apply specific commit" },
      { command: "git tag v1.0.0", description: "Create lightweight tag" },
      { command: "git tag -a v1.0.0 -m 'message'", description: "Create annotated tag" },
      { command: "git push --tags", description: "Push all tags" },
      { command: "git submodule add <url>", description: "Add submodule" },
      { command: "git submodule update --init", description: "Initialize submodules" },
    ],
  },
]

const codeSnippets: CodeSnippet[] = [
  {
    title: "Laravel Route with Middleware",
    description: "Protected route with authentication middleware",
    code: `Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::resource('posts', PostController::class);
});`,
    language: "php",
    category: "laravel",
  },
  {
    title: "Laravel Eloquent Relationship",
    description: "One-to-many relationship example",
    code: `// User Model
public function posts()
{
    return $this->hasMany(Post::class);
}

// Post Model
public function user()
{
    return $this->belongsTo(User::class);
}`,
    language: "php",
    category: "laravel",
  },
  {
    title: "jQuery AJAX Request",
    description: "Simple AJAX request with error handling",
    code: `$.ajax({
    url: '/api/data',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
        console.log('Success:', response);
    },
    error: function(xhr, status, error) {
        console.error('Error:', error);
    }
});`,
    language: "javascript",
    category: "jquery",
  },
  {
    title: "MySQL Join Query",
    description: "Inner join with multiple tables",
    code: `SELECT u.name, p.title, c.name as category
FROM users u
INNER JOIN posts p ON u.id = p.user_id
INNER JOIN categories c ON p.category_id = c.id
WHERE u.active = 1
ORDER BY p.created_at DESC;`,
    language: "sql",
    category: "mysql",
  },
  {
    title: "CSS Flexbox Center",
    description: "Perfect centering with flexbox",
    code: `.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}`,
    language: "css",
    category: "css",
  },
  {
    title: "JavaScript Async/Await",
    description: "Modern async function with error handling",
    code: `async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}`,
    language: "javascript",
    category: "javascript",
  },
]

const commonErrors: CommonError[] = [
  // Laravel Errors
  {
    title: "Class not found",
    description: "Laravel class not found error",
    error: "Class 'App\\Models\\User' not found",
    solution: `1. Check if the class exists in the correct namespace
2. Run: composer dump-autoload
3. Check the use statement at the top of your file
4. Verify the class name spelling
5. Check if the file is in the correct directory`,
    category: "laravel",
  },
  {
    title: "SQLSTATE Connection Refused",
    description: "Database connection error in Laravel",
    error: "SQLSTATE[HY000] [2002] Connection refused",
    solution: `1. Check database credentials in .env file
2. Ensure database server is running
3. Verify DB_HOST, DB_PORT, DB_DATABASE values
4. Run: php artisan config:cache
5. Check if MySQL/PostgreSQL service is running`,
    category: "laravel",
  },
  {
    title: "Route not defined",
    description: "Laravel route not found error",
    error: "Route [login] not defined",
    solution: `1. Check if route exists in routes/web.php or routes/api.php
2. Verify route name matches: Route::get('/login', [Controller::class, 'method'])->name('login');
3. Clear route cache: php artisan route:clear
4. Check middleware redirects
5. Run: php artisan route:list to see all routes`,
    category: "laravel",
  },
  {
    title: "Target class does not exist",
    description: "Laravel controller not found",
    error: "Target class [App\\Http\\Controllers\\HomeController] does not exist",
    solution: `1. Check if controller file exists
2. Verify namespace in controller file
3. Run: php artisan make:controller HomeController
4. Check controller name spelling in routes
5. Run: composer dump-autoload`,
    category: "laravel",
  },
  {
    title: "Column not found",
    description: "Database column doesn't exist",
    error: "SQLSTATE[42S22]: Column not found: 1054 Unknown column",
    solution: `1. Check column name spelling in query/model
2. Run migration: php artisan migrate
3. Check if column exists in database table
4. Verify fillable array in model
5. Check database schema`,
    category: "laravel",
  },
  {
    title: "Mass assignment exception",
    description: "Laravel mass assignment protection",
    error: "Add [field_name] to fillable property to allow mass assignment",
    solution: `1. Add field to $fillable array in model:
   protected $fillable = ['name', 'email', 'field_name'];
2. Or use $guarded instead:
   protected $guarded = ['id'];
3. Use Model::unguard() temporarily (not recommended)
4. Use create() or update() with specific fields`,
    category: "laravel",
  },
  {
    title: "Middleware not found",
    description: "Laravel middleware class not found",
    error: "Class 'App\\Http\\Middleware\\CustomMiddleware' not found",
    solution: `1. Create middleware: php artisan make:middleware CustomMiddleware
2. Register in app/Http/Kernel.php
3. Check namespace and class name
4. Verify middleware alias in Kernel.php
5. Check middleware file location`,
    category: "laravel",
  },
  {
    title: "View not found",
    description: "Laravel view file doesn't exist",
    error: "View [welcome] not found",
    solution: `1. Check if view file exists in resources/views/
2. Verify file extension (.blade.php)
3. Check view name spelling
4. Clear view cache: php artisan view:clear
5. Check view path configuration`,
    category: "laravel",
  },
  {
    title: "Storage link not found",
    description: "Laravel storage symlink missing",
    error: "The stream or file could not be opened in append mode",
    solution: `1. Create storage link: php artisan storage:link
2. Check storage permissions: chmod -R 775 storage/
3. Check if storage/app/public exists
4. Verify FILESYSTEM_DISK in .env
5. Check web server permissions`,
    category: "laravel",
  },
  {
    title: "Composer autoload error",
    description: "Composer autoloader issues",
    error: "Class 'Vendor\\Package\\Class' not found",
    solution: `1. Run: composer install
2. Run: composer dump-autoload
3. Check composer.json autoload section
4. Verify package installation: composer show
5. Clear config cache: php artisan config:clear`,
    category: "laravel",
  },

  // MySQL Errors
  {
    title: "Access denied for user",
    description: "MySQL authentication error",
    error: "Access denied for user 'root'@'localhost'",
    solution: `1. Check username and password
2. Reset MySQL root password:
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
3. Grant privileges:
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
4. Flush privileges: FLUSH PRIVILEGES;
5. Check if user exists: SELECT User FROM mysql.user;`,
    category: "mysql",
  },
  {
    title: "Table doesn't exist",
    description: "MySQL table not found error",
    error: "Table 'database.table_name' doesn't exist",
    solution: `1. Check table name spelling
2. Verify database name
3. Run migrations: php artisan migrate
4. Check if you're connected to correct database
5. Show tables: SHOW TABLES;`,
    category: "mysql",
  },
  {
    title: "Duplicate entry error",
    description: "MySQL unique constraint violation",
    error: "Duplicate entry 'value' for key 'PRIMARY'",
    solution: `1. Check for existing records before insert
2. Use INSERT IGNORE or ON DUPLICATE KEY UPDATE
3. Check unique constraints: SHOW INDEX FROM table_name;
4. Use proper WHERE clause in UPDATE
5. Check auto_increment values`,
    category: "mysql",
  },
  {
    title: "Data too long for column",
    description: "MySQL column size exceeded",
    error: "Data too long for column 'column_name' at row 1",
    solution: `1. Increase column size: ALTER TABLE table_name MODIFY column_name VARCHAR(500);
2. Check data length before insert
3. Truncate data if necessary
4. Use TEXT type for long content
5. Check column definition: DESCRIBE table_name;`,
    category: "mysql",
  },
  {
    title: "Foreign key constraint fails",
    description: "MySQL foreign key violation",
    error: "Cannot add or update a child row: a foreign key constraint fails",
    solution: `1. Check if referenced record exists
2. Insert parent record first
3. Check foreign key constraints: SHOW CREATE TABLE table_name;
4. Temporarily disable checks: SET FOREIGN_KEY_CHECKS=0;
5. Verify column data types match`,
    category: "mysql",
  },
  {
    title: "Connection timeout",
    description: "MySQL connection timeout error",
    error: "Lost connection to MySQL server during query",
    solution: `1. Increase wait_timeout: SET SESSION wait_timeout=600;
2. Check max_allowed_packet size
3. Optimize long-running queries
4. Check network connectivity
5. Increase connect_timeout in my.cnf`,
    category: "mysql",
  },
  {
    title: "Syntax error in SQL",
    description: "MySQL SQL syntax error",
    error: "You have an error in your SQL syntax near 'FROM' at line 1",
    solution: `1. Check SQL syntax carefully
2. Verify table and column names
3. Check for missing commas or quotes
4. Use proper MySQL version syntax
5. Test query in MySQL client first`,
    category: "mysql",
  },
  {
    title: "Lock wait timeout exceeded",
    description: "MySQL transaction lock timeout",
    error: "Lock wait timeout exceeded; try restarting transaction",
    solution: `1. Check for long-running transactions
2. Increase innodb_lock_wait_timeout
3. Use shorter transactions
4. Check for deadlocks: SHOW ENGINE INNODB STATUS;
5. Restart MySQL service if needed`,
    category: "mysql",
  },

  // Git Errors
  {
    title: "fatal: not a git repository",
    description: "Git repository not initialized",
    error: "fatal: not a git repository (or any of the parent directories): .git",
    solution: `1. Initialize git repository: git init
2. Navigate to correct directory
3. Check if .git folder exists
4. Clone repository if working with remote: git clone <url>
5. Check current directory: pwd`,
    category: "git",
  },
  {
    title: "Permission denied (publickey)",
    description: "Git SSH authentication error",
    error: "Permission denied (publickey)",
    solution: `1. Generate SSH key: ssh-keygen -t rsa -b 4096 -C "email@example.com"
2. Add key to SSH agent: ssh-add ~/.ssh/id_rsa
3. Copy public key: cat ~/.ssh/id_rsa.pub
4. Add to GitHub/GitLab SSH keys
5. Test connection: ssh -T git@github.com`,
    category: "git",
  },
  {
    title: "Your branch is ahead of origin",
    description: "Local commits not pushed to remote",
    error: "Your branch is ahead of 'origin/main' by 1 commit",
    solution: `1. Push commits: git push origin main
2. Or force push if needed: git push --force-with-lease
3. Check remote URL: git remote -v
4. Pull first if behind: git pull origin main
5. Check branch tracking: git branch -vv`,
    category: "git",
  },
  {
    title: "Merge conflict",
    description: "Git merge conflicts need resolution",
    error: "Automatic merge failed; fix conflicts and then commit the result",
    solution: `1. Open conflicted files and resolve conflicts
2. Look for <<<<<<< ======= >>>>>>> markers
3. Choose which changes to keep
4. Remove conflict markers
5. Stage resolved files: git add <file>
6. Complete merge: git commit`,
    category: "git",
  },
  {
    title: "Remote repository not found",
    description: "Git remote repository doesn't exist",
    error: "fatal: repository 'https://github.com/user/repo.git' not found",
    solution: `1. Check repository URL spelling
2. Verify repository exists and is accessible
3. Check permissions (private repos)
4. Update remote URL: git remote set-url origin <new-url>
5. Check authentication credentials`,
    category: "git",
  },
  {
    title: "Branch already exists",
    description: "Trying to create existing branch",
    error: "fatal: A branch named 'feature-branch' already exists",
    solution: `1. Switch to existing branch: git checkout feature-branch
2. Delete and recreate: git branch -d feature-branch
3. Use different branch name
4. Check existing branches: git branch -a
5. Force create: git checkout -B feature-branch`,
    category: "git",
  },
  {
    title: "Cannot push to non-bare repository",
    description: "Pushing to checked out branch",
    error: "refusing to update checked out branch",
    solution: `1. Push to different branch
2. Create bare repository for pushing
3. Use git pull instead of push
4. Set up proper remote repository
5. Check repository configuration`,
    category: "git",
  },
  {
    title: "Detached HEAD state",
    description: "Working in detached HEAD state",
    error: "You are in 'detached HEAD' state",
    solution: `1. Create new branch: git checkout -b new-branch-name
2. Switch to existing branch: git checkout main
3. If you made changes, commit them first
4. Check current state: git status
5. View branches: git branch -a`,
    category: "git",
  },

  // jQuery Errors
  {
    title: "jQuery is not defined",
    description: "jQuery not loaded error",
    error: "ReferenceError: $ is not defined",
    solution: `1. Include jQuery before your script:
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
2. Or use $(document).ready() wrapper
3. Check if jQuery CDN is accessible
4. Use jQuery instead of $ if conflict exists
5. Check browser console for loading errors`,
    category: "jquery",
  },
  {
    title: "Element not found",
    description: "jQuery selector returns empty",
    error: "Cannot read property 'length' of undefined",
    solution: `1. Check element selector spelling
2. Ensure element exists in DOM
3. Wait for DOM ready: $(document).ready()
4. Check element ID/class names
5. Use .length to check if element exists`,
    category: "jquery",
  },
  {
    title: "AJAX request failed",
    description: "jQuery AJAX error",
    error: "AJAX request failed with status 404",
    solution: `1. Check URL spelling and path
2. Verify server endpoint exists
3. Check HTTP method (GET, POST, etc.)
4. Add error handling in AJAX call
5. Check server logs for errors
6. Verify CSRF tokens if required`,
    category: "jquery",
  },
]

export function DeveloperDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("shortcuts")
  const { toast } = useToast()

  const copyToClipboard = async (text: string, title: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      toast({
        title: "Copied!",
        description: `${title} copied to clipboard`,
      })
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const filteredSnippets = codeSnippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredErrors = commonErrors.filter(
    (error) =>
      error.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.error.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="shortcuts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" />
            Shortcuts
          </TabsTrigger>
          <TabsTrigger value="git" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Terminal className="w-4 h-4 mr-2" />
            Git Commands
          </TabsTrigger>
          <TabsTrigger value="snippets" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Code className="w-4 h-4 mr-2" />
            Code Snippets
          </TabsTrigger>
          <TabsTrigger value="errors" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Common Errors
          </TabsTrigger>
        </TabsList>

        {/* Shortcuts Tab */}
        <TabsContent value="shortcuts">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shortcuts.map((section, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">{item.description}</span>
                        <Badge
                          variant="outline"
                          className="text-xs border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-700"
                          onClick={() => copyToClipboard(item.key, item.description)}
                        >
                          {item.key}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Git Commands Tab */}
        <TabsContent value="git">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gitCommands.map((section, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-green-400" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.commands.map((cmd, cmdIndex) => (
                      <div key={cmdIndex} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <code className="text-green-400 text-sm bg-slate-900/50 px-2 py-1 rounded">
                            {cmd.command}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(cmd.command, cmd.description)}
                            className="text-slate-400 hover:text-white"
                          >
                            {copiedText === cmd.command ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-slate-400 text-xs">{cmd.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Code Snippets Tab */}
        <TabsContent value="snippets">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search code snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredSnippets.map((snippet, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-400" />
                        {snippet.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">{snippet.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {snippet.language}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900/50 rounded-lg p-4 relative">
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{snippet.code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(snippet.code, snippet.title)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-white"
                    >
                      {copiedText === snippet.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Common Errors Tab */}
        <TabsContent value="errors">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search errors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid gap-6">
            {filteredErrors.map((error, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        {error.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">{error.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {error.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2">Error:</h4>
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                      <code className="text-red-300 text-sm">{error.error}</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">Solution:</h4>
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                      <pre className="text-green-300 text-sm whitespace-pre-wrap">{error.solution}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
