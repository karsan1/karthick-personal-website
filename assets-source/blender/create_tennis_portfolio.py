"""Create the Phase 04 Blender source scene and export its static partitions.

Run from the repository root with:
  blender --background --python assets-source/blender/create_tennis_portfolio.py
"""
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parents[2]
EXPORTS = ROOT / "assets-source" / "blender-exports"
BLEND = ROOT / "assets-source" / "blender" / "TennisPortfolio.blend"

for object_ in list(bpy.data.objects):
    bpy.data.objects.remove(object_, do_unlink=True)
for collection in list(bpy.data.collections):
    bpy.data.collections.remove(collection)

scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1.0
scene.world.color = (0.02, 0.04, 0.03)

collections = {}
for name in [
    "ENV_Court", "ENV_Net", "ENV_Stadium", "ENV_UmpireChair", "ENV_Benches",
    "ENV_Scoreboard", "PROP_Rackets", "PROP_Balls", "PROP_BallCart",
    "CHAR_PlayerA", "CHAR_PlayerB", "CHAR_Umpire", "LIGHT_References",
    "CAMERA_References",
]:
    collection = bpy.data.collections.new(name)
    scene.collection.children.link(collection)
    collections[name] = collection

def material(name, color, metallic=0.0, roughness=0.78):
    value = bpy.data.materials.new(name)
    value.diffuse_color = (*color, 1.0)
    value.use_nodes = True
    bsdf = value.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return value

COURT = material("MAT_Court", (0.075, 0.255, 0.17))
LINE = material("MAT_Line", (0.86, 0.91, 0.85))
NET = material("MAT_Net", (0.55, 0.63, 0.56))
HARDWARE = material("MAT_Hardware", (0.075, 0.11, 0.09), 0.45)
SEATING = material("MAT_Seating", (0.15, 0.19, 0.17))
ACCENT = material("MAT_Accent", (0.62, 0.78, 0.23), 0.0, 0.55)

def box(collection, name, dimensions, location, mat):
    # Inputs use the application/glTF contract (X right, Y up, Z north).
    # Blender is Z-up and its exporter maps Blender +Y to glTF -Z, so convert
    # both position and dimensions at this one boundary.
    blender_location = (location[0], -location[2], location[1])
    blender_dimensions = (dimensions[0], dimensions[2], dimensions[1])
    bpy.ops.mesh.primitive_cube_add(size=1, location=blender_location)
    object_ = bpy.context.object
    object_.name = name
    object_.dimensions = blender_dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    for existing in list(object_.users_collection):
        existing.objects.unlink(object_)
    collection.objects.link(object_)
    object_.data.materials.append(mat)
    return object_

box(collections["ENV_Court"], "ENV_Court_Surface", (8.2, 0.25, 12.4), (0, -0.13, 0), COURT)
for name, size, position in [
    ("LINE_BaselineSouth", (7.7, .025, .07), (0, .015, -5.8)),
    ("LINE_BaselineNorth", (7.7, .025, .07), (0, .015, 5.8)),
    ("LINE_SidelineWest", (.07, .025, 11.6), (-3.85, .015, 0)),
    ("LINE_SidelineEast", (.07, .025, 11.6), (3.85, .015, 0)),
    ("LINE_ServiceSouth", (5, .025, .055), (0, .015, -2.1)),
    ("LINE_ServiceNorth", (5, .025, .055), (0, .015, 2.1)),
    ("LINE_CenterSouth", (.055, .025, 2.1), (0, .015, -1.05)),
    ("LINE_CenterNorth", (.055, .025, 2.1), (0, .015, 1.05)),
]: box(collections["ENV_Court"], name, size, position, LINE)
box(collections["ENV_Net"], "ENV_Net_TopBand", (8, .06, .06), (0, 1.07, 0), LINE)
box(collections["ENV_Net"], "ENV_Net_Mesh", (7.9, 1.07, .025), (0, .535, 0), NET)
for name, position in [("ENV_Net_PostWest", (-4, .59, 0)), ("ENV_Net_PostEast", (4, .59, 0))]:
    box(collections["ENV_Net"], name, (.09, 1.18, .09), position, HARDWARE)
for name, size, position in [
    ("ENV_Stadium_BackdropNorth", (15, 3.4, .3), (0, 1.7, 8)),
    ("ENV_Stadium_BackdropSouth", (15, 3.4, .3), (0, 1.7, -8)),
    ("ENV_Stadium_RiserWest", (.7, 1.1, 16), (-7.1, .55, 0)),
    ("ENV_Stadium_RiserEast", (.7, 1.1, 16), (7.1, .55, 0)),
]: box(collections["ENV_Stadium"], name, size, position, HARDWARE if "Backdrop" in name else SEATING)
for name, size, position, mat in [
    ("ENV_UmpireChair_Seat", (.55, .18, .45), (4.65, 1.05, .35), HARDWARE),
    ("ENV_UmpireChair_Back", (.55, .7, .09), (4.65, 1.55, .52), HARDWARE),
    ("ENV_UmpireChair_LegWest", (.08, 1.2, .08), (4.45, .52, .35), SEATING),
    ("ENV_UmpireChair_LegEast", (.08, 1.2, .08), (4.85, .52, .35), SEATING),
]: box(collections["ENV_UmpireChair"], name, size, position, mat)
for name, position in [("ENV_Benches_North", (-5.15, .35, 4.2)), ("ENV_Benches_South", (-5.15, .35, -4.2))]:
    box(collections["ENV_Benches"], name, (2.3, .4, .55), position, SEATING)
box(collections["ENV_Scoreboard"], "ENV_Scoreboard_Frame", (2.7, 1.45, .16), (0, 2.5, 7.76), HARDWARE)
box(collections["ENV_Scoreboard"], "ENV_Scoreboard_Display", (2.35, 1.08, .03), (0, 2.5, 7.64), ACCENT)

EXPORTS.mkdir(parents=True, exist_ok=True)
BLEND.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND))

def export_glb(filename, collection_names):
    bpy.ops.object.select_all(action="DESELECT")
    for collection_name in collection_names:
        for object_ in collections[collection_name].all_objects:
            object_.select_set(True)
    bpy.context.view_layer.objects.active = next(iter(collections[collection_names[0]].all_objects))
    bpy.ops.export_scene.gltf(filepath=str(EXPORTS / filename), export_format="GLB", use_selection=True,
                              export_apply=True, export_cameras=False, export_lights=False,
                              export_animations=False)

export_glb("court.glb", ["ENV_Court", "ENV_Net"])
export_glb("stadium-shell.glb", ["ENV_Stadium"])
export_glb("props.glb", ["ENV_UmpireChair", "ENV_Benches"])
export_glb("scoreboard.glb", ["ENV_Scoreboard"])
print(f"Wrote {BLEND} and static GLBs to {EXPORTS}")
