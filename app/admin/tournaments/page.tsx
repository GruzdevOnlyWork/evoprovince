"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Calendar, MapPin, Users, Trophy, Medal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Tournament {
  id: string
  title: string
  description: string
  date: string
  location: string
  participants: string | null
  image_url: string | null
  status: string
  status_type: string
  is_past: boolean
}

interface Winner {
  id: string
  tournament_id: string
  place: number
  name: string
  team: string
}

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isWinnersDialogOpen, setIsWinnersDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Tournament | null>(null)
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    participants: "",
    image_url: "",
    status: "Готовится",
    status_type: "default",
    is_past: false,
  })
  const [winnersData, setWinnersData] = useState([
    { place: 1, name: "", team: "" },
    { place: 2, name: "", team: "" },
    { place: 3, name: "", team: "" },
  ])

  const supabase = createClient()

  const fetchData = async () => {
    const [tournamentsResult, winnersResult] = await Promise.all([
      supabase.from("tournaments").select("*").order("date", { ascending: false }),
      supabase.from("tournament_winners").select("*"),
    ])

    if (tournamentsResult.error) console.error("Error fetching tournaments:", tournamentsResult.error)
    if (winnersResult.error) console.error("Error fetching winners:", winnersResult.error)

    setTournaments(tournamentsResult.data || [])
    setWinners(winnersResult.data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      ...formData,
      participants: formData.participants || null,
      image_url: formData.image_url || null,
    }

    const { error } = editingItem
      ? await supabase.from("tournaments").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editingItem.id)
      : await supabase.from("tournaments").insert([data])

    if (error) { toast.error("Ошибка: " + error.message); return }

    toast.success(editingItem ? "Турнир обновлён" : "Турнир добавлен")
    setIsDialogOpen(false)
    setEditingItem(null)
    resetForm()
    fetchData()
  }

  const handleWinnersSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTournament) return

    const validWinners = winnersData.filter((w) => w.name.trim())

    if (validWinners.length > 0) {
      const { error: delErr } = await supabase
        .from("tournament_winners")
        .delete()
        .eq("tournament_id", selectedTournament.id)

      if (delErr) { toast.error("Ошибка удаления старых победителей: " + delErr.message); return }

      const { error: insErr } = await supabase.from("tournament_winners").insert(
        validWinners.map((w) => ({
          tournament_id: selectedTournament.id,
          place: w.place,
          name: w.name.trim(),
          team: w.team.trim(),
        })),
      )

      if (insErr) { toast.error("Ошибка сохранения победителей: " + insErr.message); return }
    } else {
      const { error } = await supabase.from("tournament_winners").delete().eq("tournament_id", selectedTournament.id)
      if (error) { toast.error("Ошибка: " + error.message); return }
    }

    toast.success("Победители сохранены")
    setIsWinnersDialogOpen(false)
    setSelectedTournament(null)
    fetchData()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      participants: "",
      image_url: "",
      status: "Готовится",
      status_type: "default",
      is_past: false,
    })
  }

  const handleEdit = (item: Tournament) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date,
      location: item.location,
      participants: item.participants || "",
      image_url: item.image_url || "",
      status: item.status,
      status_type: item.status_type,
      is_past: item.is_past,
    })
    setIsDialogOpen(true)
  }

  const handleEditWinners = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    const tournamentWinners = winners.filter((w) => w.tournament_id === tournament.id)
    setWinnersData([
      tournamentWinners.find((w) => w.place === 1) || { place: 1, name: "", team: "" },
      tournamentWinners.find((w) => w.place === 2) || { place: 2, name: "", team: "" },
      tournamentWinners.find((w) => w.place === 3) || { place: 3, name: "", team: "" },
    ])
    setIsWinnersDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот турнир?")) return

    const { error } = await supabase.from("tournaments").delete().eq("id", id)
    if (error) { toast.error("Ошибка удаления: " + error.message); return }
    toast.success("Турнир удалён")
    fetchData()
  }

  const openNewDialog = () => {
    setEditingItem(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const upcomingTournaments = tournaments.filter((t) => !t.is_past)
  const pastTournaments = tournaments.filter((t) => t.is_past)

  const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
    const tournamentWinners = winners.filter((w) => w.tournament_id === tournament.id)

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={tournament.status_type === "success" ? "default" : "secondary"}>
                  {tournament.status}
                </Badge>
                {tournament.is_past && <Badge variant="outline">Завершен</Badge>}
              </div>
              <CardTitle className="text-lg">{tournament.title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEditWinners(tournament)} title="Победители">
                <Trophy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(tournament)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(tournament.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{tournament.description}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {new Date(tournament.date).toLocaleDateString("ru-RU")}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {tournament.location}
            </div>
            {tournament.participants && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {tournament.participants}
              </div>
            )}
          </div>

          {tournamentWinners.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                Победители
              </h4>
              <div className="space-y-1">
                {tournamentWinners
                  .sort((a, b) => a.place - b.place)
                  .map((winner) => (
                    <div key={winner.id} className="flex items-center gap-2 text-sm">
                      <Medal
                        className={`h-4 w-4 ${winner.place === 1 ? "text-yellow-600" : winner.place === 2 ? "text-gray-400" : "text-amber-700"}`}
                      />
                      <span className="font-medium">{winner.name}</span>
                      <span className="text-muted-foreground">- {winner.team}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Турниры</h1>
          <p className="text-muted-foreground">Управление турнирами и соревнованиями</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить турнир
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Редактировать турнир" : "Новый турнир"}</DialogTitle>
              <DialogDescription>Заполните информацию о турнире</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  placeholder="Кубок области по воркауту"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  placeholder="Описание турнира"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Дата</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Статус</Label>
                  <Input
                    placeholder="Регистрация открыта"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Место проведения</Label>
                <Input
                  placeholder="Центральный стадион"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Участники</Label>
                <Input
                  placeholder="До 50 участников"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>URL изображения</Label>
                <Input
                  placeholder="/tournament-image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_past}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_past: checked })}
                />
                <Label>Завершенный турнир</Label>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">{editingItem ? "Сохранить" : "Добавить"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isWinnersDialogOpen} onOpenChange={setIsWinnersDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Победители турнира</DialogTitle>
              <DialogDescription>{selectedTournament?.title}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleWinnersSubmit} className="space-y-4">
              {winnersData.map((winner, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <Medal
                      className={`h-5 w-5 ${winner.place === 1 ? "text-yellow-600" : winner.place === 2 ? "text-gray-400" : "text-amber-700"}`}
                    />
                    <span className="text-sm font-medium">{winner.place} место</span>
                  </div>
                  <Input
                    placeholder="Имя"
                    value={winner.name}
                    onChange={(e) => {
                      const newData = [...winnersData]
                      newData[idx] = { ...newData[idx], name: e.target.value }
                      setWinnersData(newData)
                    }}
                  />
                  <Input
                    placeholder="Команда"
                    value={winner.team}
                    onChange={(e) => {
                      const newData = [...winnersData]
                      newData[idx] = { ...newData[idx], team: e.target.value }
                      setWinnersData(newData)
                    }}
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsWinnersDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">Сохранить</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Предстоящие ({upcomingTournaments.length})</TabsTrigger>
            <TabsTrigger value="past">Прошедшие ({pastTournaments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
              {upcomingTournaments.length === 0 && (
                <Card className="md:col-span-2">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Нет предстоящих турниров
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid gap-6 md:grid-cols-2">
              {pastTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
              {pastTournaments.length === 0 && (
                <Card className="md:col-span-2">
                  <CardContent className="py-12 text-center text-muted-foreground">Нет прошедших турниров</CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
