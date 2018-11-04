#!/usr/bin/perl

sub findData{
	my ($searchString, $fileName) = @_;
	$searchString =~ s/\s+/\\s+/ig;
	print "Finding $searchString in file $fileName\n";

	open(hFile, $fileName);
	# open(hFile,"1.xml");
	my $sRow = '';
	while (my $s=<hFile>){
		$sRow .= $s;
	}
	close(hFile);
	print "readed\n";

	$sRow =~ s/<\/RECORD>/<\/RECORD>\n/g;
	open(hOut,">test.xml");
	print hOut $sRow;
	close(hOut);
	print "saved\n";

	open(hFile,"test.xml");
	open(hOut,">>out.xml");
	my $index = 0;
	while (my $s=<hFile>){
		if ($s =~ m/$searchString/i){
			print hOut $s;
		}
		$index++;
		if ($index % 50000 == 0){
			print "processed $index\n";
		}
	}
	close(hFile);
	unlink 'test.xml';
	close(hOut);
}

unlink 'out.xml';
my $sFilesDir = 'd:/EDR';
my $searchStr = '>œ¿–“≤ﬂ Ã»–”';
# for ($i=1; $i < 6; $i++){
# 	findData($searchStr, "$sFilesDir/15.1-EX_XML_EDR_UO.00$i");
# }
# for ($i=1; $i < 7; $i++){
# 	findData($searchStr, "15.2-EX_XML_EDR_FOP.00$i");
# }
# findData($searchStr, "$sFilesDir/15.1-EX_XML_EDR_UO.xml");
# findData($searchStr, "$sFilesDir/15.2-EX_XML_EDR_FOP.xml");
# findData($searchStr, "$sFilesDir/16-Ex_Xml_Rgo.xml");
findData($searchStr, "$sFilesDir/17-ex_xml_rgf.xml");
# findData($searchStr, "$sFilesDir/22-ex_xml_dzmi.xml");
