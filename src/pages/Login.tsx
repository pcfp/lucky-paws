import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/fetchApi'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const LoginPage =() => {

  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await login(name, email)
      console.log('Login successful:', response.status)
      // Ensure we're authenticated before navigating
      if (response.status === 200) {
        navigate('/lucky-dogs/search')
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login failed', err)
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center ">
      <div className="w-full max-w-sm">
      <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login / Sign up</CardTitle>
          <CardDescription>
            Enter your name and email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                placeholder="John Doe" 
                id="name" 
                type="text" 
                required 
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <Button 
              variant="outline" 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
      </div>
    </div>
  )
}

export default LoginPage;