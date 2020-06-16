const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const divider = '-'.repeat(50)

async function main(){
    
    await inquirer.prompt({message:'Would you like to create a new team?', name:'create', type:'confirm'})
    .then(async function(team){
        //Create Team
        if(team.create){
            let teamList = []
            const manager = await staffInput('Manager')
            teamList.push(new Manager(1, manager.name, manager.email, manager.officeNumber))

            // Get Team Members
            for (let i = 0; i < manager.staff; i++){
                console.log(divider)
                await inquirer.prompt({message:`Choose staff member ${i+1}:`, name:'member', type:'list', choices:['Engineer','Intern']})
                .then(async function(staff){
                    const staffMember = await staffInput(staff.member)
                    const staffClass = eval(`new ${staff.member}(${i+2},'${staffMember.name}','${staffMember.email}','${(staff.member=='Engineer')? staffMember.github : staffMember.school}')`)
                    teamList.push(staffClass)
                })
            }

            fs.writeFileSync( outputPath, render(teamList))
        }
        console.log(`${divider}${team.create? `\nSuccess! Team has been created.`:''}\nThank you and have a nice day!\n`)
    })
}


// Staff Input Function
async function staffInput(member){
    const staffInput = await inquirer.prompt([
        { message: `${member} name:`, name:'name', type:'input'},
        { message: `${member} email:`, name:'email', type:'input'},
        { message: `${member} GitHub username:`, name: 'github', type:'input', when: member == 'Engineer'}, 
        { message: `${member} school:`, name: 'school', type:'input', when: member == 'Intern'},
        { message: `${member} office number:`, name: 'officeNumber', type:'number', when: member == 'Manager'},
        { message: staff => `How many staff(s) under manager ${staff.name}?`, name:'staff', type:'number', when: member == 'Manager'}    
    ])
    return staffInput
}

// Run App
main()