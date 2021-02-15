
const urlBase = "https://fcawebbook.herokuapp.com"




window.onload = () => {
    // References to HTML objects   
    const btnParticipant = document.getElementById("btnParticipant")
    const tblParticipants = document.getElementById("tblParticipants")

    const renderParticipants = async () => {
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Participantes</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Nome</th>
                    <th class='w-38'>E-mail</th>              
                    <th class='w-10'>Ações</th>              
                </tr> 
            </thead><tbody>
        `
        const response = await fetch(`${urlBase}/conferences/1/participants`)
        const participants = await response.json()
        let i = 1
        for (const participant of participants) {            
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${participant.nomeParticipante}</td>
                    <td>${participant.idParticipant}</td>
                    <td><i id='${participant.idParticipant}' class='fas fa-trash-alt remove'></i></td>
                </tr>
            `        
            i++
        }
        strHtml += "</tbody>"
        tblParticipants.innerHTML = strHtml
       

        // Manage click delete        
        const btnDelete = document.getElementsByClassName("remove")
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", () => {
                swal({
                    title: 'Tem a certeza?',
                    text: "Não será possível reverter a remoção!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Remover'
                  }).then( async (result) => {
                    if (result.value) {                        
                        let participantId = btnDelete[i].getAttribute("id")
                        try {
                            const response = await fetch(`${urlBase}/conferences/1/participants/${participantId}`, { method: "DELETE"})
                            const participants = await response.json()                            
                            swal('Removido!','O participante foi removido da Conferência.','success')
                            renderParticipants()
                        } catch(err) {
                            swal({type: 'error', title: 'Erro', text: err})
                        }
                    } 
                  })
            })
        }       
    }
 renderParticipants()
}