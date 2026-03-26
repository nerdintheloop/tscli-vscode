import { tscli } from '@nerdintheloop/tscli'
import { chdir } from 'node:process'
import { blue, bold, cyan, green, italic, LogMessageIcon, magenta, red, yellow } from './log.ts'

chdir(new URL('..', import.meta.url).pathname)

tscli`
ALIAS_BLACKLIST log
CHILD_PROCESS_ENV PATH
RUNTIME_REQUIRED bun

build Builds extension

log Logs a message with a timestamp, a message type icon character and an optional logger label
  --alert -A Uses the alert icon character: ${LogMessageIcon.Alert}
  --blue -b Prints the icon character and label in ${blue('blue')}
  --bold -B Prints the icon character and label in ${bold('bold')}
  --check -C Uses the check icon character: ${LogMessageIcon.Check}
  --cross -X Uses the cross icon character: ${LogMessageIcon.Cross}
  --cyan -c Prints the icon character and label in ${cyan('cyan')}
  --green -g Prints the icon character and label in ${green('green')}
  --info -I Uses the info icon character: ${LogMessageIcon.Info}
  --italic -i Prints the label in ${italic('italic')}
  --label -l string The logger label
  --magenta -m Prints the icon character and label in ${magenta('magenta')}
  --red -r Prints the icon character and label in ${red('red')}
  --timer-start -t Starts a timer
  --timer-stop -T Stops timer if started and outputs timer duration
  --yellow -y Prints the icon character and label in ${yellow('yellow')}
  --wait -W Uses the wait icon character: ${LogMessageIcon.Wait}
  ...message string The log message

publish Publishes extension to the Open VSX Registry or the Visual Studio Marketplace
  --ovsx-token -o string Open VSX Registry access token
  --vsce-token -v string Visual Studio Marketplace access token

update Updates dependencies to their latest versions
`
