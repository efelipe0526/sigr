import { useState, type FormEvent } from 'react'
import { KeyRound, LogIn, ShieldCheck, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { demoAccounts } from '../data/menu'
import type { User } from '../types'

interface LoginSectionProps {
  user: User | null
  onLogin: (username: string, password: string) => string | null
  onLogout: () => void
}

const roleLabels = { cliente: 'Cliente', mesero: 'Mesero', administrador: 'Administrador' }

export function LoginSection({ user, onLogin, onLogout }: LoginSectionProps) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    const result = onLogin(username, password)
    setError(result ?? '')
  }

  if (user) {
    return <section><div className="section-heading"><div><span className="eyebrow">Control de acceso</span><h2>Sesión activa</h2></div></div><div className="panel session-card"><span className="session-icon"><UserRound size={32} /></span><div><h3>{user.name}</h3><p>{roleLabels[user.role]}</p></div><Button variant="outline" onClick={onLogout}>Cerrar sesión</Button></div></section>
  }

  return (
    <section>
      <div className="section-heading"><div><span className="eyebrow">Acceso por roles</span><h2>Iniciar sesión</h2><p>Utiliza una cuenta demostrativa para validar los permisos del sistema.</p></div></div>
      <div className="login-layout">
        <form className="panel form-panel" onSubmit={submit}>
          <label>Usuario<div className="input-with-icon"><UserRound size={17} /><input value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" /></div></label>
          <label>Contraseña<div className="input-with-icon"><KeyRound size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></div></label>
          <Button className="sigr-button" type="submit"><LogIn size={17} /> Ingresar</Button>
          {error && <p className="error-message" role="alert">{error}</p>}
        </form>
        <div className="panel credentials-panel">
          <h3><ShieldCheck size={20} /> Cuentas de demostración</h3>
          <p>La autenticación es local y está destinada exclusivamente a la validación académica del prototipo.</p>
          {demoAccounts.map((account) => <button className="credential-row" key={account.username} onClick={() => { setUsername(account.username); setPassword(account.password) }}><span><strong>{roleLabels[account.role]}</strong><small>{account.name}</small></span><code>{account.username} / {account.password}</code></button>)}
        </div>
      </div>
    </section>
  )
}
