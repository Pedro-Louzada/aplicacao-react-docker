import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import http from "../../../http"
import IPrato from "../../../interfaces/IPrato"
import IRestaurante from "../../../interfaces/IRestaurante"
import ITag from "../../../interfaces/ITag"

const FormularioPrato = () => {

    const parametros = useParams()

    useEffect(() => {
        if (parametros.id) {
            http.get<IPrato>(`pratos/${parametros.id}/`)
                .then(resposta => setNomePrato(resposta.data.nome))
        }
    }, [parametros])

    const [nomePrato, setNomePrato] = useState('')
    const [descricao, setDescricao] = useState('')

    const [tag, setTag] = useState('')
    const [restaurante, setRestaurante] = useState('')

    const [imagem, setImagem] = useState<File | null>(null)

    const [tags, setTags] = useState<ITag[]>([])
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])

    useEffect(() => {
        http.get<{ tags: ITag[] }>('tags/')
            .then(resposta => setTags(resposta.data.tags))
        http.get<IRestaurante[]>('restaurantes/')
            .then(resposta => setRestaurantes(resposta.data))
    }, [])

    /*no caso do cenário de arquivos, no DOM, o evento de arquivos sempre é uma lista, 
    criando um if para que se algum arquivo for selecionado nós colocaremos dentro do state, ou
    passaremos nulo como valor*/
    /* Por que files[0] ? Por que nós só poderemos escolher um arquivo de cada vez*/
    const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
        if (evento.target.files?.length) {
            setImagem(evento.target.files[0])
        } else {
            setImagem(null)
        }
    }

    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault()

        /*Nós utilzamos a classe FormData para conseguirmos enviar além de string, arquivos... 
        pois o JSON não é capaz de compreender arquivo binário, e com o formData nós conseguiremos submeter o formulário
        */
        if (parametros.id) {
            const formData = new FormData();

            //append >> incluir
            // lado esquerdo colocamos oq a API e do lado direito o valor
            formData.append('nome', nomePrato)
            formData.append('descricao', descricao)

            formData.append('tag', tag)

            formData.append('restaurante', restaurante)

            //if pois a imagem é opicional

            if (imagem) {
                formData.append('imagem', imagem)
            }

            http.request({
                url: 'pratos/',
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            })
                .then(() => {
                    setNomePrato('')
                    setDescricao('')
                    setTag('')
                    setRestaurante('')
                    alert('Prato atualizado com sucesso!')
                })
                .catch(erro => console.log(erro))

        } else {
            const formData = new FormData();

            //append >> incluir
            // lado esquerdo colocamos oq a API e do lado direito o valor
            formData.append('nome', nomePrato)
            formData.append('descricao', descricao)

            formData.append('tag', tag)

            formData.append('restaurante', restaurante)

            //if pois a imagem é opicional

            if (imagem) {
                formData.append('imagem', imagem)
            }

            http.request({
                url: 'pratos/',
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            })
                .then(() => {
                    setNomePrato('')
                    setDescricao('')
                    setTag('')
                    setRestaurante('')
                    alert('Prato cadastrado com sucesso!')
                })
                .catch(erro => console.log(erro))
        }

    }

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Pratos</Typography>
            <Box component="form" sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
                <TextField
                    value={nomePrato}
                    onChange={evento => setNomePrato(evento.target.value)}
                    label="Nome do Prato"
                    variant="standard"
                    fullWidth
                    required
                    margin="dense"
                />
                <TextField
                    value={descricao}
                    onChange={evento => setDescricao(evento.target.value)}
                    label="Descrição do Prato"
                    variant="standard"
                    fullWidth
                    required
                    margin="dense"
                />

                <FormControl margin="dense" fullWidth >
                    <InputLabel id="select-tag">Tag</InputLabel>
                    <Select labelId="select-tag" value={tag} onChange={evento => setTag(evento.target.value)}>
                        {tags.map(tag => <MenuItem key={tag.id} value={tag.value}>
                            {tag.value}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl margin="dense" fullWidth >
                    <InputLabel id="select-restaurante">Restaurante</InputLabel>
                    <Select labelId="select-restaurante" value={restaurante} onChange={evento => setRestaurante(evento.target.value)}>
                        {restaurantes.map(restaurante => <MenuItem key={restaurante.id} value={restaurante.id}>
                            {restaurante.nome}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                {/* type = "file" ja deixa meu input com a estilização de um botão de seleção de arquivos*/}
                <input type="file" onChange={selecionarArquivo} />

                <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
            </Box>
        </Box>
    )
}

export default FormularioPrato