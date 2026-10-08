#!/usr/bin/env python3
"""Generates rive/engagement/scene.rml: the progress rail under the "How an engagement runs" figures.
Four nodes on a track; a `step` number (0 to 3) fills the track, lights the node, and pulses a ring around it.
Clicking a node writes `step`. Edit here, then see rive/README.md."""
import itertools, pathlib

n = itertools.count(2)
def nid(): return f"0:{next(n)}"

W, H = 640, 120
CYAN = "FF35D6F5"
NODE_X = [120, 253, 387, 520]
NODE_Y = 60
PROG_W = [0, 133, 267, 400]

art, style = nid(), nid()
vm, vm_prop, vm_inst = nid(), nid(), nid()
sm, layer = nid(), nid()
nodes = [nid() for _ in range(4)]
dots = [nid() for _ in range(4)]
rings = [nid() for _ in range(4)]
prog = nid()
state_ids = [nid() for _ in range(4)]
anim_ids = [nid() for _ in range(4)]

def key(prop, frames_vals, interp=1):
    ks = "".join(f'<KeyFrameDouble value="{v}" interpolationType="{interp}"' + (f' frame="{f}"' if f else "") + "/>" for f, v in frames_vals)
    return f'<KeyedProperty propertyKey="{prop}">{ks}</KeyedProperty>'

def step_animation(i):
    out = [f'<LinearAnimation loopValue="1" duration="100" name="Step {i+1}" id="{anim_ids[i]}">']
    for j in range(4):
        o = 1 if j == i else (0.5 if j < i else 0)
        out.append(f'<KeyedObject objectId="{dots[j]}">{key(18, [(0, o)], 0)}</KeyedObject>')
        if j == i:  # a ring that swells and fades from the active node, over and over
            out.append(f'<KeyedObject objectId="{rings[j]}">'
                       + key(16, [(0, 1), (100, 1.9)]) + key(17, [(0, 1), (100, 1.9)]) + key(18, [(0, 0.9), (100, 0)])
                       + '</KeyedObject>')
        else:
            out.append(f'<KeyedObject objectId="{rings[j]}">{key(18, [(0, 0)], 0)}</KeyedObject>')
    out.append(f'<KeyedObject objectId="{prog}">{key(20, [(0, PROG_W[i])], 0)}</KeyedObject>')
    out.append("</LinearAnimation>")
    return "".join(out)

def transitions(i):
    t = []
    for j in range(4):
        if j == i: continue
        t.append(
            f'<StateTransition stateToId="{state_ids[j]}" duration="500">'
            f'<TransitionViewModelCondition opValue="equal">'
            f'<TransitionPropertyViewModelComparator><BindablePropertyNumber>'
            f'<DataBindContext sourcePathIds="{vm}-{vm_prop}" propertyKey="636"/>'
            f'</BindablePropertyNumber></TransitionPropertyViewModelComparator>'
            f'<TransitionValueNumberComparator value="{j}"/>'
            f'</TransitionViewModelCondition></StateTransition>')
    return "".join(t)

# Draw order in Rive: the first sibling is in FRONT. Build back-to-front, then reverse.
scene = []
scene.append(f'<Shape x="{NODE_X[0]}" y="{NODE_Y}" name="Track"><Rectangle width="{NODE_X[3]-NODE_X[0]}" height="3" originX="0" originY="0.5" cornerRadiusTL="1.5" name="Path"/><Fill name="Fill"><SolidColor colorValue="FF1E2328" name="C"/></Fill></Shape>')
scene.append(f'<Shape x="{NODE_X[0]}" y="{NODE_Y}" name="Progress"><Rectangle width="0" height="3" originX="0" originY="0.5" cornerRadiusTL="1.5" name="Path" id="{prog}"/><Fill name="Fill"><SolidColor colorValue="{CYAN}" name="C"/></Fill></Shape>')
for k in range(4):
    scene.append(f'<Shape x="{NODE_X[k]}" y="{NODE_Y}" opacity="0" name="Ring {k+1}" id="{rings[k]}"><Ellipse width="34" height="34" name="Path"/>'
                 f'<Stroke thickness="2" name="Stroke"><SolidColor colorValue="{CYAN}" name="C"/></Stroke></Shape>')
    scene.append(f'<Shape x="{NODE_X[k]}" y="{NODE_Y}" name="Node {k+1}" id="{nodes[k]}"><Ellipse width="34" height="34" name="Path"/>'
                 f'<Fill name="Fill"><SolidColor colorValue="FF111418" name="C"/></Fill>'
                 f'<Stroke thickness="2" name="Stroke"><SolidColor colorValue="FF2E353C" name="C"/></Stroke></Shape>')
    scene.append(f'<Shape x="{NODE_X[k]}" y="{NODE_Y}" opacity="{1 if k == 0 else 0}" name="Dot {k+1}" id="{dots[k]}"><Ellipse width="18" height="18" name="Path"/>'
                 f'<Fill name="Fill"><SolidColor colorValue="{CYAN}" name="C"/></Fill></Shape>')

x = ['<Rive version="1" kind="fragment">']
x.append(f'<Artboard defaultStateMachineId="{sm}" viewModelId="{vm}" viewModelInstanceId="{vm_inst}" width="{W}" height="{H}" styleId="{style}" name="Rail" id="{art}">')
x.append(f'<LayoutComponentStyle name="Artboard Style" id="{style}"/>')
x.extend(reversed(scene))
x.append(f'<StateMachine name="Journey" id="{sm}">')
for k in range(4):
    x.append(f'<StateMachineListenerSingle targetId="{nodes[k]}" listenerTypeValue="click" name="Pick {k+1}">'
             f'<ListenerViewModelChange><BindablePropertyNumber propertyValue="{k}">'
             f'<DataBindContext sourcePathIds="{vm}-{vm_prop}" propertyKey="636" direction="true"/>'
             f'</BindablePropertyNumber></ListenerViewModelChange></StateMachineListenerSingle>')
x.append(f'<StateMachineLayer name="Step" id="{layer}"><AnyState x="200" y="-160"/><ExitState x="600" y="-160"/>'
         f'<EntryState><StateTransition stateToId="{state_ids[0]}"/></EntryState>')
for k in range(4):
    x.append(f'<AnimationState x="200" y="{k * 90}" animationId="{anim_ids[k]}" id="{state_ids[k]}">{transitions(k)}</AnimationState>')
x.append('</StateMachineLayer></StateMachine>')
for i in range(4):
    x.append(step_animation(i))
x.append('</Artboard>')
x.append(f'<ViewModel defaultInstanceId="{vm_inst}" name="Journey" id="{vm}"><ViewModelPropertyNumber name="step" id="{vm_prop}"/>'
         f'<ViewModelInstance exports="true" name="Default" id="{vm_inst}"><ViewModelInstanceNumber propertyValue="0" viewModelPropertyId="{vm_prop}"/></ViewModelInstance></ViewModel>')
x.append('</Rive>')
pathlib.Path(__file__).with_name("engagement").joinpath("scene.rml").write_text("\n".join(x))
print("ok")
