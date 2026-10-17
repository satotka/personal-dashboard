import sys,json,subprocess,os,base64,tarfile
print('Ready for credential JSON',flush=True)
c=json.loads(sys.stdin.readline())
def run(args,env=None):
 p=subprocess.run(args,text=True,capture_output=True,env=env)
 if p.returncode: raise RuntimeError(p.stderr.replace(c['token'],'[redacted]'))
 return p.stdout.strip()
run(['git','init','-b',c['branch']]);run(['git','config','user.name','Codex']);run(['git','config','user.email','codex@openai.com'])
run(['git','add','.']);run(['git','commit','-m','Build private mobile personal dashboard'])
env=os.environ.copy();env.update({'GIT_CONFIG_COUNT':'1','GIT_CONFIG_KEY_0':'http.extraHeader','GIT_CONFIG_VALUE_0':'Authorization: Bearer '+c['token'],'GIT_TERMINAL_PROMPT':'0'})
run(['git','push',c['remote_url'],'HEAD:'+c['branch']],env)
with tarfile.open('/workspace/sites/pocket-deploy.tar.gz','w:gz') as tar:
 tar.add('.openai/hosting.json',arcname='.openai/hosting.json');tar.add('dist',arcname='dist')
print(json.dumps({'commit_sha':run(['git','rev-parse','HEAD']),'archive':'/workspace/sites/pocket-deploy.tar.gz'}),flush=True)
