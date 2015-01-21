//namespace scope
(function( DMI, $, undefined ){
		
var MSite = DMI.MSite = DMI.MSite || {};
var MNation = DMI.MNation = DMI.MNation || {};
var MUnit = DMI.MUnit = DMI.MUnit || {};

var Format = DMI.Format;
var Utils = DMI.Utils;

var modctx = DMI.modctx;
var modconstants = DMI.modconstants;


MNation.initNation = function(o) {
	o.foreignunits = [];
	o.forestrec = [];
	o.forestcom = [];
	o.mountainrec = [];
	o.mountaincom = [];
	o.swamprec = [];
	o.swampcom = [];
	o.wasterec = [];
	o.wastecom = [];
	o.caverec = [];
	o.cavecom = [];
	o.coastrec = [];
	o.coastcom = [];
	o.landunit = [];
	o.landcom = [];
	o.capunits = [];
	o.capcommanders = [];
	o.pretenders = [];
	o.commanders = [];
	o.foreigncommanders = [];
	o.units = [];
	o.heroes = [];	
	o.multiheroes = [];
	o.uwunit = [];
	o.uwcom = [];
	o.sites = [];
	o.spells = [];
	o.homerealm = [];
	o.addgod = [];
	o.delgod = [];
}
MNation.prepareData_PreMod = function() {
	for (var oi=0, o;  o= modctx.nationdata[oi];  oi++) {
		
		o.pretenders = [];
		o.commanders = [];
		o.foreigncommanders = [];
		o.units = [];
		o.foreignunits = [];
		o.sites = [];
		o.forestrec = [];
		o.forestcom = [];
		o.mountainrec = [];
		o.mountaincom = [];
		o.swamprec = [];
		o.swampcom = [];
		o.wasterec = [];
		o.wastecom = [];
		o.caverec = [];
		o.cavecom = [];
		o.coastcom = [];
		o.coastrec = [];
		o.uwcom = [];
		o.uwunit = [];
		o.landcom = [];
		o.landunit = [];
		o.heroes = [];	
		o.multiheroes = [];
		o.spells = [];
		o.addgod = [];
		o.delgod = [];
		// Get realms of nation
		var realms = [];
		for (var oj=0, attr; attr = modctx.attributes_by_nation[oj];  oj++) {
			if (parseInt(attr.nation_number) == o.id) {
				var attribute = modctx.attributes_lookup[parseInt(attr.attribute_record_id)];
				if (attribute.attribute_number == "289") {
					realms.push(attribute.raw_value);
				}
			}
		}
		o.homerealm = realms;
	}
}

MNation.prepareData_PostMod = function() {
	for (var oi=0, o;  o= modctx.nationdata[oi];  oi++) {
		o.id = parseInt(o.id);
		
		o.renderOverlay = MNation.renderOverlay;
		
		o.eracode = modconstants.eracodes[o.era];
		o.shortname = o.eracode+'  '+o.name;
		o.fullname = o.eracode+'  '+o.name+'  -  '+o.epithet;
		
		// Get realms of nation
		var realms = [];
		for (var oj=0, attr; attr = modctx.attributes_by_nation[oj];  oj++) {
			if (parseInt(attr.nation_number) == o.id) {
				var attribute = modctx.attributes_lookup[parseInt(attr.attribute_record_id)];
				if (attribute.attribute_number == "289") {
					realms.push(attribute.raw_value);
				}
			}
		}
		if (o.homerealm) {
			realms = realms.concat(o.homerealm);
		}
		
		// get monsters in realm
		for (var oj=0, attr; attr = modctx.realms[oj];  oj++) {
			for (var ok=0, realm; realm = realms[ok]; ok++) {
				if (parseInt(attr.realm) == parseInt(realm)) {
					o.pretenders.push(attr.monster_number);
				}
			}
		}
		o.homerealm = realms;
		
		// look for added pretenders
		if (!o.cleargods) {
			for (var oj=0, attr; attr = modctx.pretender_types_by_nation[oj];  oj++) {
				if (parseInt(attr.nation_number) == o.id) {
					o.pretenders.push(attr.monster_number);
				}
			}
		}
		if (o.addgod) {
			o.pretenders = o.pretenders.concat(o.addgod);
		}
		
		// look for deleted pretenders
		for (var oj=0, attr; attr = modctx.unpretender_types_by_nation[oj];  oj++) {
			if (parseInt(attr.nation_number) == o.id) {
				for (var ok=0, pret; pret = o.pretenders[ok]; ok++) {
					if (parseInt(pret) == parseInt(attr.monster_number)) {
						o.pretenders.splice(ok, 1);
						ok--;
					}
				}
			}
		}
		if (o.delgod) {
			o.pretenders = o.pretenders.filter(function(item) {
			    return o.delgod.indexOf(item) === -1;
			});
		}
		
		// look for commanders
		for (var oj=0, attr; attr = modctx.fort_leader_types_by_nation[oj];  oj++) {
			if (parseInt(attr.nation_number) == o.id) {
				o.commanders.push(attr.monster_number);
			}
		}
		
		// look for foreign commanders
		for (var oj=0, attr; attr = modctx.nonfort_leader_types_by_nation[oj];  oj++) {
			if (parseInt(attr.nation_number) == o.id) {
				o.foreigncommanders.push(attr.monster_number);
			}
		}
		
		// look for units
		for (var oj=0, attr; attr = modctx.fort_troop_types_by_nation[oj];  oj++) {
			if (parseInt(attr.nation_number) == o.id) {
				o.units.push(attr.monster_number);
			}
		}
		
		// look for foreign units
		for (var oj=0, attr; attr = modctx.nonfort_troop_types_by_nation[oj];  oj++) {
			if (parseInt(attr.nation_number) == o.id) {
				o.foreignunits.push(attr.monster_number);
			}
		}

		for (var oj=0, attr; attr = modctx.attributes_by_nation[oj];  oj++) {
			if (parseInt(attr.nation_number) == o.id) {
				var attribute = modctx.attributes_lookup[parseInt(attr.attribute_record_id)];
				if (attribute.attribute_number == "52" || attribute.attribute_number == "100") {
					o.sites.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "158" || attribute.attribute_number == "159") {
					o.coastcom.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "160" || attribute.attribute_number == "161" || attribute.attribute_number == "162") {
					o.coastrec.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "163") {
					o.landcom.push(parseInt(attribute.raw_value));
				}
				if (//attribute.attribute_number == "172" ||
					attribute.attribute_number == "186" ||
					attribute.attribute_number == "187" ||
					attribute.attribute_number == "188") {
					if (attr.nation_number == "83" ||
						attr.nation_number == "84" ||
						attr.nation_number == "85" ||
						attr.nation_number == "86" ||
						attr.nation_number == "87" ||
						attr.nation_number == "88" ||
						attr.nation_number == "89" ||
						attr.nation_number == "90" ||
						attr.nation_number == "92") {
					} else {
						o.uwcom.push(parseInt(attribute.raw_value));
					}
				}
				if (attribute.attribute_number == "189" || 
					attribute.attribute_number == "190" || 
					attribute.attribute_number == "191" || 
					attribute.attribute_number == "213") {
					if (attr.nation_number == "83" ||
						attr.nation_number == "84" ||
						attr.nation_number == "85" ||
						attr.nation_number == "86" ||
						attr.nation_number == "88" ||
						attr.nation_number == "89" ||
						attr.nation_number == "90" ||
						attr.nation_number == "92") {
					} else {
						o.uwunit.push(parseInt(attribute.raw_value));
					}
				}
				if (attribute.attribute_number == "294") {
					o.forestrec.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "295") {
					o.forestcom.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "296") {
					o.swamprec.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "297") {
					o.swampcom.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "298") {
					o.mountainrec.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "299") {
					o.mountaincom.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "300") {
					o.wasterec.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "301") {
					o.wastecom.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "302") {
					o.caverec.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "303") {
					o.cavecom.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "139" || 
					attribute.attribute_number == "140" || 
					attribute.attribute_number == "141" || 
					attribute.attribute_number == "142" || 
					attribute.attribute_number == "143" || 
					attribute.attribute_number == "144") {
					o.heroes.push(parseInt(attribute.raw_value));
				}
				if (attribute.attribute_number == "145" || 
					attribute.attribute_number == "146") {
					o.multiheroes.push(parseInt(attribute.raw_value));
				}
			}
		}
		
		//associate spells
		//national spells already listed themselves in o.spells
		//now we need to set nation details on the spells
		for (var si=0, s; s= o.spells[si]; si++) {			
			s.nations = s.nations || {};
			s.nations[o.id] = o;
			s.eracodes = s.eracodes || {}; 
			s.eracodes[o.eracode] = true;
			
			//nationname
			var ncount=0; for (var k in s.nations) ncount++;
			if (ncount == 1)
				s.nationname = o.shortname;
			else
				s.nationname = 'various ('+ncount+')';
			
			//set nation value on summoned units
			var spell = s;
			do {
				var arr = spell.summonsunits || [];
				for (var i=0, u; u= arr[i]; i++) {
					var basekey;
					if (u.typeclass == 'Unit') {
						basekey = 'unit (Summon)';
					} else {
						basekey = 'cmdr (Summon)';
					}
					if (u.typechar && u.typechar!=basekey) {
						//find pretender version of this unit
						u = modctx.getUnitOfType(u, basekey) || modctx.cloneUnit(u);
					}
					u.typechar = basekey;

					u.nations = u.nations || {};
					u.nations[o.id] = o;
					u.eracodes = u.eracodes || {}; 
					u.eracodes[o.eracode] = true;				

					//nationname
					var ncount=0; for (var k in u.nations) ncount++;
					if (ncount == 1)
						u.nationname = o.shortname;
					else
						u.nationname = 'various ('+ncount+')';
					
					var otherList = [];
					var other = u;
					otherList.push(other);
					while (other = modctx.unitlookup[other.secondshape || other.shapechange || other.forestshape]) {
						if (otherList.indexOf(other) != -1) {
							break;
						}
						otherList.push(other);
						other.typechar = basekey;

						other.nations = other.nations || {};
						other.nations[o.id] = o;
						other.eracodes = other.eracodes || {}; 
						other.eracodes[o.eracode] = true;				

						//nationname
						var ncount=0; for (var k in other.nations) ncount++;
						if (ncount == 1)
							other.nationname = o.shortname;
						else
							other.nationname = 'various ('+ncount+')';
					}
				}
			} while (spell = spell.nextspell);
		}
		
		//associate pretenders
 		var basekey = 'Pretender';
		var arr = o.pretenders;
		for (var i=0; i<arr.length; i++) {
			if (!arr[i]) continue;
			var u = modctx.unitlookup[arr[i]];
			if (!u) {
				console.log(basekey+' '+arr[i]+' not found (nation '+o.id+')');
				continue;
			}
			if (u.typechar && u.typechar!=basekey) {
				//find pretender version of this unit
				u = modctx.getUnitOfType(u, basekey) || modctx.cloneUnit(u);
			}
			u.typechar = basekey;
			u.nations = u.nations || {};
			u.nations[o.id] = o;
			u.eracodes = u.eracodes || {}; 
			u.eracodes[o.eracode] = true;
		}
		
		//units from sites
 		o.capunits = [];
		o.capcommanders = [];
		
		var basekey = 'site';
		var arr = o.sites;
		var gemkeys = {F:0,A:0,W:0,E:0,S:0,D:0,N:0,B:0};
		for (var i=0; i<arr.length; i++) {
			if (!arr[i]) continue;
			var s = modctx.sitelookup[arr[i]];
			if (!s) {
				console.log(basekey+' '+arr[i]+' not found (nation '+o.id+')');
				continue;
			}
			o.capunits = o.capunits.concat(s.units, s.hmon);
			o.capcommanders = o.capcommanders.concat(s.commanders, s.hcom);
			for (k in gemkeys) {
				if (s[k])
				gemkeys[k] += parseInt(s[k]);  
			}
		}
		//remove capunits duplicated in units (etc)
		Utils.arrayDisect(o.capunits, o.units)
		Utils.arrayDisect(o.capcommanders, o.commanders)

		Utils.arrayUnique(o.units);
		Utils.arrayUnique(o.commanders);
		Utils.arrayUnique(o.capunits);
		Utils.arrayUnique(o.capcommanders);
		//should do it..?
		
		o.gems = '';
		for (k in gemkeys) {
			if (gemkeys[k])
				o.gems  +=  '+'+ String(gemkeys[k]) + k; 
		}
	}

	for (var oi=0, o;  o= modctx.nationdata[oi];  oi++) {
		//////////////////////////////////////////////////
		// associate units with this nation
		//  if unit is already associated with a nation it creates a duplicate (with incremented id: +.01)
		/////////////////////////////////////////////////
		var iterations = {
			'unit': o.units, 
			'commander': o.commanders,
			'cmdr (foreign)': o.foreigncommanders,
			'unit (foreign)': o.foreignunits,
			'unit (forest)': o.forestrec,
			'cmdr (forest)': o.forestcom,
			'unit (mountain)': o.mountainrec,
			'cmdr (mountain)': o.mountaincom,
			'unit (swamp)': o.swamprec,
			'cmdr (swamp)': o.swampcom,
			'unit (waste)': o.wasterec,
			'cmdr (waste)': o.wastecom,
			'unit (cave)': o.caverec,
			'cmdr (cave)': o.cavecom,
			'unit (coast)': o.coastrec,
			'cmdr (coast)': o.coastcom,
			'unit (land)': o.landunit,
			'cmdr (land)': o.landcom,
			'hero (unique)': o.heroes,
			'hero (multi)': o.multiheroes,
			'unit (u-water)': o.uwunit,
			'cmdr (u-water)': o.uwcom,
			'unit (cap only)': o.capunits,
			'cmdr (cap only)': o.capcommanders
		}
		for (var basekey in iterations) {
			var arr = iterations[basekey];
			for (var i=0; i<arr.length; i++) {
				if (!arr[i]) continue;
				var u = modctx.unitlookup[arr[i]];
				//~ if (!u) {
					//~ console.log(basekey+' '+arr[i]+' not found (nation '+o.id+')');
					//~ continue;
				//~ }
				//~ if ((u.nation && u.nation!=o) || (u.type && u.type!=basekey))
					//~ u = modctx.cloneUnit(u);
				//~ 
				//~ u.type = basekey;
				//~ u.nation = o;
				//~ u.nationname = o.shortname;
				//~ delete u.nations;

			///////////////////////////////
				if (!u) {
					console.log(basekey+' '+arr[i]+' not found (nation '+o.id+')');
					continue;
				}
				if (u.typechar && u.typechar!=basekey) {
					//find right version of this unit
					var newu = modctx.getUnitOfType(u, basekey);
					if (newu) u = newu;
					else {
						u = modctx.cloneUnit(u);
						u.nations = {};
						u.eracodes = {};
					}
				}
				u.typechar = basekey;
				if (u.typechar.indexOf('unit') != -1) {
					if (!u.type || u.type == 'c') {
						u.type = 'u';
						MUnit.autocalc(u);
					}
				} else {
					if (!u.type || u.type == 'u') {
						u.type = 'c';
						MUnit.autocalc(u);
					}
				}
				u.nations = u.nations || {};
				if (u.nations[o.id]) continue;
				
				u.nations[o.id] = o;
				u.eracodes = u.eracodes || {}; 
				u.eracodes[o.eracode] = true;
				
				//nationname
				var ncount=0; for (var k in u.nations) ncount++;
				if (ncount == 1)
					u.nationname = o.shortname;
				else
					u.nationname = 'various ('+ncount+')';
				
				// Marverni gets Iron Boars
				if (parseInt(o.id) == 8) {
					var ironBoar = modctx.unitlookup[1808];
					ironBoar.nationname = o.shortname;
				}
			}
		}
	}
	//fill nation selection box
	var h='';
	for (var era=1; era<=3; era++) {
		h+='<option disabled=disabled>-- '+modconstants.eranames[era]+' --</option>\n';		
		for (var oi=0; oi<modctx.nationdata.length; oi++) {
			var o = modctx.nationdata[oi];
			if (o.era == era) {				
				h+='<option value="'+o.id+'" title="nation '+o.id+'">'+o.fullname+'</option>\n';
			}
		}
	}
	$('select.nation').append($(h));
	
	DMI.MUnit.prepareData_PostNationData();
}

MNation.nationSummary = function(hsh) {
	var names = [];
	
	for (k in hsh) {
		names.push( hsh[k].shortname );
	}
	if (names.length == 0) return '';
	
	if (names.length == 1)
		return names[0];
	
	else return '<span title="'+names.join(',  \n')+'">Various ('+names.length+')</span>';		
}

MNation.nationUnitRefs = function(hsh) {
	var refs = [], longRefs = [], eras = [], singlename = null;
	
	var k;
	for (k in hsh) {
		refs.push( Utils.ref('nation '+hsh[k].id, hsh[k].eracode) );
		longRefs.push( Utils.ref('nation '+hsh[k].id, hsh[k].shortname) );

		var name = hsh[k].name;
		singlename = (name==singlename || !singlename) ? name : -1; 
	}
	if (refs.length == 0) return '';
	
	if (refs.length == 1) 
		return Utils.ref('nation '+hsh[k].id, hsh[k].shortname);
		
	if (refs.length > 1 && singlename != -1) {
		return refs.join(', ') +' '+ singlename;
	}
	
	if (refs.length <= 3)
		return longRefs.join(',&nbsp; ')

	return MNation.nationSummary(hsh).replace('Various ','Various nations'); 
}
	
MNation.renderOverlay = function(o) {
	//template
	var h=''
	h+='<div class="nation overlay-contents"> ';
	
	//header
	h+='	<div class="overlay-header" title="nation id: '+o.id+'"> ';
	h+=' 		<input class="overlay-pin" type="image" src="images/PinPageTrns.png" title="unpin" />';
	h+='		<h2>'+o.fullname+'</h2> ';
	h+='	</div>';
	
	//mid
	h+='	<div class="overlay-main">';
	h+='		<div class="hidden-block">Nation #:'+o.id+'</div>'; 
	h+='		<div> '+Format.Gems(o.gems)+'</div>';
	
	//wikilink
	h+='		<div class="overlay-wiki-link non-content" style="clear:both;">' + Utils.wikiLink(o.epithet) + '</div>';
	
	//modded
	if (o.modded) {
		h+='	<div class="modded hidden-block">' + Utils.renderModded(o) +'</div>';
	}
	h+='	</div>';
	
	h+='</div> ';
	
	return h;	
}

//namespace args
}( window.DMI = window.DMI || {}, jQuery ));
